import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import onBuyClicked from '../helper/javascript'

export default function Home() {
  return (
    <>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Web Payment Test</title>
  <link rel="icon" type="image/png" href="favicon.ico" />
  <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
  />
  <div className="container">
    <h2>Web Payment Test</h2>
    <p>This page is for testing web payment.</p>
    <div id="inputSection">
      <form className="form-horizontal">
        <div className="form-group row">
          <label className="control-label col-xs-3" htmlFor="amount">
            Amount:
          </label>
          <div className="col-xs-9">
            <input
              className="form-control"
              type="number"
              id="amount"
              defaultValue="10.01"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-xs-3" htmlFor="pa">
            Payee VPA (pa):
          </label>
          <div className="col-xs-9">
            <input
              className="form-control"
              type="text"
              id="pa"
              defaultValue="merchant3@icici"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-xs-3" htmlFor="pn">
            Payee Name (pn):
          </label>
          <div className="col-xs-9">
            <input
              className="form-control"
              type="text"
              id="pn"
              defaultValue="test merchant"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-xs-3" htmlFor="tn">
            Txn Note (tn):
          </label>
          <div className="col-xs-9">
            <input
              className="form-control"
              type="text"
              id="tn"
              defaultValue="test note"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-xs-3" htmlFor="mc">
            Merchant Code (mc):
          </label>
          <div className="col-xs-9">
            <input
              className="form-control"
              type="text"
              id="mc"
              defaultValue={1234}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-xs-3" htmlFor="tid">
            Txn ID (tid):
          </label>
          <div className="col-xs-9">
            <input
              className="form-control"
              type="text"
              id="tid"
              defaultValue=""
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-xs-3" htmlFor="tr">
            Txn Ref ID (tr):
          </label>
          <div className="col-xs-9">
            <input
              className="form-control"
              type="text"
              id="tr"
              defaultValue="test reference id"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-xs-3" htmlFor="url">
            Ref URL (url):
          </label>
          <div className="col-xs-9">
            <input
              className="form-control"
              type="url"
              id="url"
              defaultValue="https://teztytreats.com/demo"
            />
          </div>
        </div>
      </form>
      <div className="form-group row clearfix">
        <div className="col-xs-12">
          <button className="btn btn-info pull-right" onClick={onBuyClicked}>
            Buy
          </button>
        </div>
      </div>
    </div>
    <div id="outputSection" style={{ display: "none" }}>
      <pre id="response" />
    </div>
  </div>
  
  
  
</>

  )
}
