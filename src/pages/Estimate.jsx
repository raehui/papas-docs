import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const estimate = () => {
  // 네비게이터 
  const navigate = useNavigate()
  const location= useLocation()

  const submitEstimate =() =>{
    navigate('/result', {state: {form, items}})
  }

  const {state} = useLocation();

  
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    manager: '',
    supplier: {
      regNo: '',
      name: '',
      ceo: '',
      address: '',
      phone: '',
      type: '',
      item: '',
    },
    customer: '',
    account: '',
    note: '',
    vatRate: 0.1, // 10%
  })

  const [items, setItems] = useState([
    { name: '', spec: '', ubit: '개', qty: '', price: '', remark: '' }

  ])

  // 수량, 단가를 직접 타이핑 입력 가능
  const parseMoney = (v) => {
    if (typeof v !== 'string') v = String(v ?? '')
    return Number(v.replaceAll(',', '').replace(/[^\d.-]/g, '')) || 0
  }
  const formatMoney = (n) => (Number.isFinite(n) ? n.toLocaleString() : '')

  const handleChange = (path) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const clone = structuredClone(prev)
      const keys = path.split('.')
      let cur = clone
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]]
      cur[keys.at(-1)] = value
      return clone
    })
  }

  const handleItemChange = (idx, key, value) => {
    setItems((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: key === 'qty' || key === 'price' ? Number(value) || 0 : value }
      return next
    })
  }

  const addItem = () => setItems((prev) => [...prev, { name: '', spec: '', unit: '', qty: '', price: '', remark: '' }])
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx))

  const supplyTotal = useMemo(() => items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0), [items])
  const vat = useMemo(() => Math.round(supplyTotal * form.vatRate), [supplyTotal, form.vatRate])
  const grand = useMemo(() => supplyTotal + vat, [supplyTotal, vat])

  const printOnlySheet = () => {
    window.print()
  }
  // 네비게이트로 받아온 데이터가 있다면 폼과 품목에 수정 전 데이터 가져오기
  useEffect(()=>{
    if(location.state?.form)setForm(location.state.form)
    if(location.state?.items)setItems(location.state.items)
  }, [location.state])

  return (
    <>
      <div className="estimate-layout">
        {/* Left: Form */}
        <div className="left-contents" style={{ width: 360 }}  >

          {/* 견적일+담당자 섹션 */}
          <div id='section1' className='mb-3'>
            <h4 className="mb-3">견적서 작성</h4>
            <label className="form-label">견적일</label>
            <input type="date" className="form-control" value={form.date} onChange={handleChange('date')} />

            <label className="form-label">담당자</label>
            <input className="form-control" placeholder="담당자" value={form.manager} onChange={handleChange('manager')} />
          </div>

          <hr />
          {/* 공급자 정보 섹션 */}
          <div id='section2' className='mb-2'>
            <h5 className="mt-3">공급자 정보</h5>

            <label className="form-label">등록번호</label>
            <input className="form-control" value={form.supplier.regNo} onChange={handleChange('supplier.regNo')} />

            <label className="form-label">상호</label>
            <input className="form-control" value={form.supplier.name} onChange={handleChange('supplier.name')} />

            <label className="form-label">대표자</label>
            <input className="form-control" value={form.supplier.ceo} onChange={handleChange('supplier.ceo')} />

            <label className="form-label">주소</label>
            <input className="form-control" value={form.supplier.address} onChange={handleChange('supplier.address')} />

            <label className="form-label">연락처</label>
            <input className="form-control" value={form.supplier.phone} onChange={handleChange('supplier.phone')} />

            <label className="form-label">업태</label>
            <input className="form-control" value={form.supplier.type} onChange={handleChange('supplier.type')} />

            <label className="form-label">종목</label>
            <input className="form-control" value={form.supplier.item} onChange={handleChange('supplier.item')} />
          </div>


          <div className="mb-3">
            <label className="form-label">거래처(귀하)</label>
            <input className="form-control" value={form.customer} onChange={handleChange('customer')} />
          </div>

          <div className="mb-3">
            <label className="form-label">입금 계좌번호</label>
            <input className="form-control" value={form.account} onChange={handleChange('account')} />
          </div>

          <div className="mb-3">
            <label className="form-label">비고</label>
            <textarea className="form-control" rows="3" value={form.note} onChange={handleChange('note')} />
          </div>

          <hr />

          <h6 className="mt-3">품목</h6>
          {items.map((it, i) => (
            <div key={i} className="border rounded p-2 mb-2">
              <div className="row g-2">
                <div className="col-6">
                  <input className="form-control" placeholder="품명" value={it.name} onChange={(e) => handleItemChange(i, 'name', e.target.value)} />
                </div>
                <div className="col-6">
                  <input className="form-control" placeholder="규격/사양" value={it.spec} onChange={(e) => handleItemChange(i, 'spec', e.target.value)} />
                </div>
                <div className="col-4">
                  <input className="form-control" placeholder="단위" value={it.unit} onChange={(e) => handleItemChange(i, 'unit', e.target.value)} />
                </div>
                <div className="col-4">
                  <input type="form-control" className="form-control" inputMode='numeric' placeholder="수량" value={it.qty} onChange={(e) => handleItemChange(i, 'qty', parseMoney(e.target.value))} />
                </div>
                <div className="col-4">
                  <input type="form-control" className="form-control" inputMode='numeric' placeholder="단가" value={it.price ? formatMoney(it.price) : ''} onChange={(e) => handleItemChange(i, 'price', parseMoney(e.target.value))} />
                </div>

                <div className="col-12">
                  <input className="form-control" placeholder="비고" value={it.remark} onChange={(e) => handleItemChange(i, 'remark', e.target.value)} />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(i)}>삭제</button>
              </div>
            </div>
          ))}
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={addItem}>품목 추가</button>
          </div>
          {/* 메뉴로 돌아가기 */}
          <button className="btn btn-primary mt-4" onClick={()=>navigate('/')}>돌아가기</button>
          {/* 작성완료 버튼 */}
          <button className="btn btn-success mt-4 float-end" onClick={submitEstimate}>작성완료</button>
        </div>


        {/* Right: A4 Preview */}
        <div className="d-flex justify-content-center">
          <div className="a4-paper shadow bg-white print-area p-4">
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
                  <div>등록번호: {form.supplier.regNo || '-'}</div>
                  <div>상호: {form.supplier.name || '-'}</div>
                  <div>대표자: {form.supplier.ceo || '-'}</div>
                  <div>주소: {form.supplier.address || '-'}</div>
                  <div>연락처: {form.supplier.phone || '-'}</div>
                  <div>업태: {form.supplier.type || '-'}</div>
                  <div>종목: {form.supplier.item || '-'}</div>
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
              <table className="table table-sm table-bordered align-middle small">
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
                    const it = items[i]
                    // 수량 창에 0개 이상의 입력 여부
                    const hasQty = it && Number(it.qty) > 0
                    // 가격 창에 0원 이상의 입력 여부
                    const hasPrice = it && Number(it.price) > 0
                    // 수량, 가격 창이 모두 입력되었는지 여부
                    const hasBoth = hasQty && hasPrice
                    // 수량 가격이 모두 입력됐다면 공급가액이 나오게끔 설정
                    const amount = hasBoth ? (it.qty * it.price) : null
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
                    )
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

            <div className="mt-3 small">
              <div>▶ 입금 계좌번호: {form.account || '-'}</div>
              <div>▶ 비고: {form.note || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default estimate