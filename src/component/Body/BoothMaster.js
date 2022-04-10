import React, { Component } from 'react';
import Save from '../../assets/save.svg';
import Cancel from '../../assets/cancel.svg';
import Search from '../../assets/search.svg';
import Edit from '../../assets/edit.svg';
import { validateBoothNo, validateIP } from '../../exports/Validate';
import axios from 'axios';

const APP_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class BoothMaster extends Component {

    constructor(props) {
        super(props);

        this.state = {
            boothno: "",
            ipaddress: "",
            searchinput: "",
            data: [],
            tableload: true,
            currdata:null
        }
        
        
        this.TopSection = this.TopSection.bind(this);
        this.SearchBox = this.SearchBox.bind(this);
        this.Table = this.Table.bind(this);
        this.THead = this.THead.bind(this);
        this.TBody = this.TBody.bind(this);
        this.save = this.save.bind(this);
        this.filter = this.filter.bind(this);
        this.edit = this.edit.bind(this);
        this.loadTable = this.loadTable.bind(this);
    }

    componentDidMount() {
        this.loadTable();
    }

    loadTable() {
        axios.get(`${APP_URL}/boothmaster/fetch`).then(res => {
            if(res.data.success) {
                this.setState({data:res.data.data, tableload: false})
            }
        }).catch(err => console.log(err))
    }



    filter() {
        const {searchinput} = this.state;
        if(searchinput.trim().length > 0) {
            this.setState({tableload: true});
            axios.get(`${APP_URL}/boothmaster/fetch?searchinput=${searchinput.trim()}`).then(res => {
                if(res.data.success) {
                    this.setState({data:res.data.data, tableload: false})
                }
            }).catch(err => console.log(err))
        }
    }

    save() {
        const {boothno, ipaddress} = this.state;

        document.getElementById('ip-input').style.border = ""
        document.getElementById('booth-input').style.border = ""

        if(validateBoothNo(boothno)) {
            if(validateIP(ipaddress)) {
                axios.post(`${APP_URL}/boothmaster/add`, {boothno: boothno.trim(), ipaddress: ipaddress.trim()}).then(res => {
                    if(res.data.success) {
                        this.setState({tableload: true, boothno: "", ipaddress:""}, () => this.loadTable())
                    }
                })
            } else {
                document.getElementById('ip-input').style.border = "solid 2px red";
            }
        } else {
            document.getElementById('booth-input').style.border = "solid 2px red"
        }
    }

    edit() {
        const {boothno, ipaddress, currdata} = this.state;
        if(validateBoothNo(boothno)) {
            if(validateIP(ipaddress)) {
                axios.post(`${APP_URL}/boothmaster/edit`, {boothno: boothno.trim(), ipaddress: ipaddress.trim(), currdata}).then(res => {
                    if(res.data.success) {
                        this.setState({tableload: true, boothno: "", ipaddress:"", currdata:null}, () => this.loadTable())
                    }
                })
            } else {
                document.getElementById('ip-input').style.border = "solid 2px red";
            }
        } else {
            document.getElementById('booth-input').style.border = "solid 2px red"
        }
    }

    TopSection() {
        const {boothno, ipaddress, currdata} = this.state;
        return (
            <div className='shadow p-3 m-3 bg-white rounded'>
                <div className='container w-50'>
                    <div className="input-group">
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">New Booth Master</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            id='booth-input'
                            placeholder='Enter Booth No'
                            value={boothno}
                            onChange={(e) => this.setState({boothno: e.target.value.trim()})}
                        />

                        <input type="text" 
                            className="form-control" 
                            id='ip-input'
                            placeholder='Enter IP Address'
                            value={ipaddress}
                            onChange={(e) => this.setState({ipaddress: e.target.value.trim()})}
                        />

                        <div className="input-group-append" style={{ display: 'flex'}}>
                            <span className="input-group-text" 
                                onClick={(e) => this.setState({boothno: "", ipaddress: "", currdata:null, tableload: false})}>
                                <img src={Cancel} alt='' width={20} />
                            </span>
                            <span className="input-group-text"
                                onClick={(e) => {
                                    if(currdata)
                                        this.edit();
                                    else
                                        this.save();
                                }}>
                                <img src={Save} alt='' width={20} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    SearchBox() {
        const {searchinput} = this.state;
        return(
            <div className='container w-50 justify-content-center'>
                <div className="input-group">
                    <div classnName="input-group-prepend" style={{ display: 'flex'}}>
                        <span className="input-group-text"
                            onClick={(e) => this.filter()}>
                            <img src={Search} alt='' width={20} />
                        </span>
                    </div>

                    <input type="text" 
                        className="form-control" 
                        placeholder='Search'
                        value={searchinput}
                        onChange={(e) => this.setState({ searchinput : e.target.value.trim()})} />

                    <div className="input-group-append" style={{ display: 'flex'}}>
                        <span className="input-group-text"
                            onClick={(e) => this.setState({searchinput: ""}, () => this.loadTable())}>
                            <img src={Cancel} alt='' width={20} />
                        </span>
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
                    <td>{el.boothno}</td>
                    <td>{el.ipaddress}</td>
                    <td 
                        style={{color: 'blue', fontSize: 13, cursor:"pointer"}}
                        onClick={() => {
                            document.getElementById("booth-input").focus()
                            this.setState({
                                boothno: el.boothno,
                                ipaddress: el.ipaddress,
                                currdata: {boothno:el.boothno, ipaddress: el.ipaddress},
                                tableload: true,
                        })}}>
                        <img src={Edit} width={12} alt='' /> Edit
                    </td>
                </tr>
            ))
        )
    }

    Table() {
        const {data, tableload} = this.state;
        if(tableload) 
            return(
                <>
                    <center>Please Wait</center>
                    <center>Loading...</center>
                </>
            )

        return(
            <>
                <this.SearchBox />
                <div className='container w-50 justify-content-center'>
                    <table className="table mt-3 table-hover">
                        <thead className="table-dark">
                            <this.THead data={["SNo", "Booth No", "IP Address", "Edit"]} />
                        </thead>
                        <tbody>
                            <this.TBody data={data} />
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
    

    render() {
        return (
            <div>
                <this.TopSection
                 />
                <div className='shadow p-3 m-3 bg-white rounded'>
                    {/* <this.SearchBox />   */}
                    <this.Table />
                </div>
            </div>
        );
    }
}

export default BoothMaster;