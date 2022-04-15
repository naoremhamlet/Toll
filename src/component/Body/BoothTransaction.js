import React, { Component } from 'react';
// import Save from '../../assets/save.svg';
import Cancel from '../../assets/cancel.svg';
import Search from '../../assets/search.svg';
// import Edit from '../../assets/edit.svg';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import Delete from "../../assets/delete.svg";
import axios from 'axios';
import moment from 'moment';
// import DateTimeField from 'react-bootstrap-datetimepicker';
import Pagination from "react-js-pagination";



const APP_URL = process.env.REACT_APP_REQUEST_BASE_URL;


class BoothTransaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            to: "",
            from: "",
            boothno: "",
            active: "transaction",
            data: [],
            revenue: [],
            booths: [],
            tableload: true,
            revenueload: true,
            boothnos: [],
            vehicles:[],
            pageno:1,
            pagecount: 0
        }

        this.Table = this.Table.bind(this);
        this.THead = this.THead.bind(this);
        this.TBody = this.TBody.bind(this);
        this.SearchBox = this.SearchBox.bind(this);
        this.SelectBox = this.SelectBox.bind(this);
        this.Revenue = this.Revenue.bind(this);
        this.loadTable = this.loadTable.bind(this);
        this.delete = this.delete.bind(this);
        this.filter = this.filter.bind(this);
        this.fetchrevenue = this.fetchrevenue.bind(this);
    }

    componentDidMount() {
        axios.get(`${APP_URL}/boothmaster/fetch`).then(res => {
            if(res.data.success) {
                const booths = res.data.data.map(el => el.boothno);
                this.setState({booths})
            }
        }).catch(err => console.log(err))

        axios.get(`${APP_URL}/boothtransaction/pagecount`).then(res => {
            console.log(res.data.pagecount)
            if(res.data.success) {
                this.setState({pagecount: res.data.pagecount})
            }
        }).catch(err => console.log(err))

        this.loadTable()
    }

    loadTable() { 
        axios.get(`${APP_URL}/boothtransaction/fetch`).then(res => {
            if(res.data.success) {
                this.setState({ tableload: false, data: res.data.data }) 
            }
        })
    }

    filter() {
        let {boothno, to, from} = this.state;

        to = moment(to).format('YYYY-MM-DD HH:mm:ss')
        from = moment(from).format('YYYY-MM-DD HH:mm:ss')

        let url = `${APP_URL}/boothtransaction/fetch?`

        if(boothno.trim().length>0)
            url+=`boothno=${boothno}&`
        if(moment(to).isValid())
            url+=`to=${to.split(' ').join('T')}&`
        if(moment(from).isValid())
            url+=`from=${from.split(' ').join('T')}`

        axios.get(url).then(res => {
            if(res.data.success) {
                this.setState({data: res.data.data, tableload: false});
            }
        })
    }

    delete(t_id) {
        axios.post(`${APP_URL}/boothtransaction/delete`, {t_id}).then(res => {
            if(res.data.success)
                this.loadTable();
        }).catch(err => console.log(err));
    }

    fetchrevenue() {
        axios.get(`${APP_URL}/boothtransaction/revenue`).then(res => {
            if(res.data.success) {
                this.setState({
                    revenue: res.data.data, 
                    boothno:"",
                    to:"",
                    from:"", 
                    revenueload:false, 
                    boothnos: res.data.boothnos,
                    vehicles: res.data.vehicles
                })
            }
        })
    }

   
    SelectBox({data, placeholder}) {
        const {boothno} = this.state;
        return(
            <select 
                class="form-select" 
                style={{ maxWidth: 150}}
                onChange={(e) => this.setState({boothno: e.target.value})} >
                <option selected hidden>{placeholder}</option>
                {data.map(el =>(
                    el===boothno?
                    <option selected value={el}>{el}</option> : <option value={el}>{el}</option>
                ))}
            </select>
        )
    }

    SearchBox() {
        const {from, to, active, booths, boothno} = this.state;
        return(
            <div className='shadow p-3 m-3 bg-white rounded'>
                <div className='container'>
                    <div className="input-group">
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">Booth</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            placeholder='Booth Name'
                            value={boothno}
                            onChange={(e) => this.setState({boothno: e.target.value.trimStart()})} />

                        <this.SelectBox 
                            placeholder={"All"}
                            data={booths}
                        />
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">From</span>
                        </div>
                        <Datetime 
                            inputProps={{ placeholder: 'DD-MM-YYYY' }}
                            onChange={(e) => this.setState({from: e._d})}
                            value={from}
                            dateFormat="DD-MM-YYYY" />
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">To</span>
                        </div>
                        <Datetime 
                            inputProps={{ placeholder: 'DD-MM-YYYY'}}
                            onChange={(e) => this.setState({to: e._d})}
                            value={to}
                            dateFormat="DD-MM-YYYY" />
                        <div className="input-group-append" style={{ display: 'flex'}}>
                            <span className="input-group-text" 
                                onClick={() => this.setState({boothno:""},()=>this.loadTable())}>
                                <img src={Cancel} alt='' width={20} />
                            </span>
                            <span className="input-group-text" onClick={(e) => this.filter()}>
                                <img src={Search} alt='' width={20} />
                            </span>
                            <span className="input-group-text" 
                                style={{cursor:"pointer"}} 
                                onClick={(e) => this.setState({
                                    active: active==="revenue"?"transaction":"revenue",
                                    boothno: "",
                                    to:"",
                                    from: ""
                                }, () => this.fetchrevenue())} >
                                {active==="revenue"?"Transaction":"Revenue"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    THead({data}) {
        return (
            <tr>
                {data.map(el => (
                    <th>{el}</th>
                ))}
            </tr>
        )
    }

    TBody({data}) {
        return(
            data.map((el,i) => (
                <tr>
                    <td>{i+1}</td>
                    <td>{el.t_id}</td>
                    <td>{el.e_code}</td>
                    <td>{el.b_no}</td>
                    <td>{el.l_no}</td>
                    <td>{el.s_no}</td>
                    <td>{el.v_type}</td>
                    <td>{el.v_no}</td>
                    <td>{el.j_type}</td>
                    <td>{el.v_st_wt}</td>
                    <td>{el.v_wt}</td>
                    <td>{el.amount}</td>
                    <td>{moment(el.date).format('DD-MM-YYYY HH:mm')}</td>
                    <td
                        style={{cursor:"pointer"}}
                        onClick={(e) => this.delete(el.t_id)} >
                        <img src={Delete} alt='' width={20} />
                    </td>
                </tr>
            ))
        )
    }

    handlePageChange(pageNumber) {
        axios.get(`${APP_URL}/boothtransaction/fetch?page=${pageNumber}`).then(res => {
            if(res.data.success) {
                this.setState({ tableload: false, data: res.data.data, pageno: pageNumber }) 
            }
        })
    }

    Table() {
        const {data, pagecount, pageno} = this.state;
        return(
            <div className='container w-75 justfiy-content-center'>
                <table className="table mt-3 table-hover">
                    <thead className="table-dark">
                        <this.THead data={["SNo", "Transaction Id", "Emp Code", "Booth no","Lane No","Shift No", "Vehicle Type","Vehicle No",
                            "Journey Type","Vehicle st. wt.", "Vehicle wt.", "Amount", "Date", ""]} />
                    </thead>
                    <tbody>
                        <this.TBody data={data} />
                    </tbody>
                </table>
                {pagecount?
                    <Pagination
                        activePage={pageno}
                        itemsCountPerPage={10}
                        totalItemsCount={pagecount}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={this.handlePageChange.bind(this)}
                    />:null
                }
            </div>
        )
    }

    RBody({data, vehicles, boothnos}) {
        return(
            <>
            {
                data.map((el,i) => (
                    <tr>
                        <td>{el.boothno}</td>
                        {
                            vehicles.map(d => (
                                <td>{el[`${d}`]}</td>
                            ))
                        }
                        <td className='table-secondary'>{Object.values(el).slice(1).reduce((a,b) => a+parseInt(b),0)}</td>
                    </tr>
                ))

            }
            <tr className='table-secondary'>
                <td>Total</td>
                {
                    vehicles.map(d => (
                        <td>{data.reduce((a,b) => a+parseInt(b[`${d}`]), 0)}</td>
                    ))
                }
                <td>{data.reduce((a,b) => a+Object.values(b).slice(1).reduce((c,d) => c+parseInt(d),0), 0)}</td>
            </tr>
            </>
        )
    }


    Revenue() {
        const {revenue, vehicles, boothnos} = this.state;
        return(
            <div className='container w-75 justfiy-content-center'>
                <table className="table mt-3 table-hover">
                    <thead className="table-dark">
                        <this.THead data={["Booth", ...vehicles, "Total"]} />
                    </thead>
                    <tbody>
                        <this.RBody data={revenue} vehicles={vehicles} boothnos={boothnos} />
                    </tbody>
                </table>
            </div>
        )
    }
    

    render() {
        const {active} = this.state;
        return (
            <div>
                {active==="transaction" &&
                    <div className='shadow p-3 m-3 bg-white rounded'>
                        <this.SearchBox />  
                        <this.Table />
                    </div>
                }
                {active==="revenue" &&
                    <div className='shadow p-3 m-3 bg-white rounded'>
                        <this.SearchBox /> 
                        <this.Revenue />
                    </div>
                }
            </div>
        );
    }
}

export default BoothTransaction;