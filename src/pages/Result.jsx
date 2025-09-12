import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
	const navigate = useNavigate();
	// estimate.jsx 에서 보낸 데이터 받기
	const { state } = useLocation();
	// 받은 state(form,items) 가 존재한다면 해당 데이터 꺼내기
	const form = state?.form || {};
	const items = state?.items || [];

	// 여기는 중복되는데....? 중복 안되게 만들 수는 없는 것인가? 
	// 공급가액 합계 구하는 함수
	const supplyTotal = useMemo(() => items.reduce((s, it) => {
		const hasBoth = Number(it?.qty) > 0 && Number(it?.price) > 0;
		return s + (hasBoth ? (it.qty * it.price) : 0);
	}, 0), [items]);
	// 셰액 구하는 함수
	const vat = useMemo(() => Math.round(supplyTotal * (form.vatRate ?? 0.1)), [supplyTotal, form.vatRate]);
	// 공급가액 합계 + 세액 
	const grand = useMemo(() => supplyTotal + vat, [supplyTotal, vat]);

	

	// pdf 다운로드 
	const handleDownload = async () => {
		// pdf로 다운로드 할 영역 가져오기
		const element = document.getElementById("pdf-content");
		if (!element) return;

		// 다운할 영역을 캔버스로 가져오고
		const canvas = await html2canvas(element, {
			scale:2,
			useCORSL: true
		});
		// 그걸 이미지 데이터로 변경
		const imgData = canvas.toDataURL("image/png");

		// jsPDF 객체 생성 (세로 방향, 단위mm, A4 용지 사이즈)
		const pdf = new jsPDF("p", "mm", "a4");

		// 이미지 크기 계산(비율 유지하며 pdf 가로폭에 맞춤)
		const imgProps = pdf.getImageProperties(imgData);
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

		// PDF에 이미지 추가(계산된 크리 적용)
		pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
		// 최종적으로 PDF 다운로드(파일명: download.pdf)
		pdf.save("견적서.pdf");
	}



	if (!state) {
		return (
			<div className="text-center py-5">
				<p>전달된 견적 데이터가 없습니다.</p>
				<button className="btn btn-primary" onClick={() => navigate('/estimate')}>견적서로 이동</button>
			</div>
		);
	}

	return (
		<>
			<div className="d-flex justify-content-between mb-3">
				<button className="btn btn-outline-secondary" onClick={() => navigate('/estimate', {state: {form, items}})}>← 문서 수정</button>
				<button className="btn btn-primary" onClick={handleDownload}>내보내기 →</button>
			</div>

			<div className="d-flex justify-content-center">
				<div className="a4-paper shadow bg-white print-area p-4" id='pdf-content'>
					<div className="d-flex justify-content-between align-items-center">
						<h3 className="fw-bold m-0">견적서</h3>
						<div className="text-end small">
							<div>견적일: {form.date}</div>
							<div>담당자: {form.manager || '-'}</div>
						</div>
					</div>

					<hr />

					<div className="row g-2 small">
						<div className="col-6">
							<div className="border p-2 rounded h-100">
								<div className="fw-bold mb-1">공급자</div>
								<div>등록번호: {form.supplier?.regNo || '-'}</div>
								<div>상호: {form.supplier?.name || '-'}</div>
								<div>대표자: {form.supplier?.ceo || '-'}</div>
								<div>주소: {form.supplier?.address || '-'}</div>
								<div>연락처: {form.supplier?.phone || '-'}</div>
								<div>업태: {form.supplier?.type || '-'}</div>
								<div>종목: {form.supplier?.item || '-'}</div>
							</div>
						</div>
						<div className="col-6">
							<div className="border p-2 rounded h-100">
								<div className="fw-bold mb-1">귀하</div>
								<div>거래처: {form.customer || '-'}</div>
							</div>
						</div>
					</div>

					<div className="mt-3 small text-end">합계금액(부가세포함): <span className="fw-bold">{grand.toLocaleString()} 원</span></div>

					<div className="mt-2">
						<table className="table table-sm table-bordered align-middle small table-strong">
							<thead>
								<tr className="text-center bg-light">
									<th style={{ width: 40 }}>No</th>
									<th>품명</th>
									<th>규격/사양</th>
									<th style={{ width: 60 }}>수량</th>
									<th style={{ width: 60 }}>단위</th>
									<th style={{ width: 120 }}>단가</th>
									<th style={{ width: 140 }}>공급가액</th>
									<th>비고</th>
								</tr>
							</thead>
							<tbody>
								{Array.from({ length: 20 }).map((_, i) => {
									const it = items[i];
									const hasQty = it && Number(it.qty) > 0;
									const hasPrice = it && Number(it.price) > 0;
									const hasBoth = hasQty && hasPrice;
									const amount = hasBoth ? (it.qty * it.price) : null;
									return (
										<tr key={i}>
											<td className="text-center">{i + 1}</td>
											<td>{it?.name || ''}</td>
											<td>{it?.spec || ''}</td>
											<td className="text-end">{hasQty ? it.qty : ''}</td>
											<td className="text-center">{it?.unit || ''}</td>
											<td className="text-end">{hasPrice ? it.price.toLocaleString() : ''}</td>
											<td className="text-end">{hasBoth ? amount.toLocaleString() : ''}</td>
											<td>{it?.remark || ''}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					<div className="d-flex justify-content-end small">
						<table className="table table-sm table-bordered w-auto mb-0">
							<tbody>
								<tr>
									<th className="bg-light">공급가액 합계</th>
									<td className="text-end" style={{ width: 160 }}>{supplyTotal.toLocaleString()} 원</td>
								</tr>
								<tr>
									<th className="bg-light">세액(VAT)</th>
									<td className="text-end">{vat.toLocaleString()} 원</td>
								</tr>
								<tr>
									<th className="bg-light">합계(부가세 포함)</th>
									<td className="text-end fw-bold">{grand.toLocaleString()} 원</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="mt-3 small no-break print-break-before">
						<div>▶ 입금 계좌번호: {form.account || '-'}</div>
						<div>▶ 비고: {form.note || '-'}</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Result;