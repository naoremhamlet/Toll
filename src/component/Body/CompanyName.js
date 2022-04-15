import React, { Component } from 'react';
import Save from '../../assets/save.svg';
import Cancel from '../../assets/cancel.svg';
import Search from '../../assets/search.svg';
import Edit from '../../assets/edit.svg';
import axios from 'axios';

const APP_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class CompanyName extends Component {

    constructor(props) {
        super(props);

        this.state = {
            company: "",
            data: [],
            tableload: true,
            searchinput: "",
            currdata:null,
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
        this.loadTable()
    }

    loadTable() {
        axios.get(`${APP_URL}/companyname/fetch`).then(res => {
            if(res.data.success) {
                this.setState({data:res.data.data, tableload: false})
            }
        }).catch(err => console.log(err));
    }

    filter() {
        const {searchinput} = this.state;
        if(searchinput.trim().length > 0) {
            this.setState({tableload: true})
            axios.get(`${APP_URL}/companyname/fetch?searchinput=${searchinput.trim()}`).then(res => {
                if(res.data.success) {
                    this.setState({data:res.data.data, tableload: false})
                }
            }).catch(err => console.log(err));
        }

    }

    save() {
        const {company} = this.state;
        document.getElementById("company-input").style.border = "";
        if(company.trim().length > 0) {
            axios.post(`${APP_URL}/companyname/add`, {company: company.trim()}).then(res => {
                if(res.data.success) {
                    this.setState({tableload: true, company: ""}, () => this.loadTable());
                }
            })
        } else {
            document.getElementById("company-input").style.border = "solid 2px red";
        }
    }

    edit() {
        const {company, currdata} = this.state;
        document.getElementById("company-input").style.border = "";
        if(company.trim().length > 0) {
            axios.post(`${APP_URL}/companyname/edit`, {company: company.trim(), currdata}).then(res => {
                if(res.data.success) {
                    this.setState({tableload: true, company: "", currdata:null}, () => this.loadTable());
                }
            })
        } else {
            document.getElementById("company-input").style.border = "solid 2px red";
        }
    }

    TopSection() {
        const {company, currdata, data} = this.state;
        return (
            <div className='shadow p-3 m-3 bg-white rounded'>
                <div className='container w-50'>
                    <div className="input-group">
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">New Company Name</span>
                        </div>

                        <input 
                            type="text" 
                            className="form-control" 
                            id='company-input'
                            placeholder='Enter Company Name'
                            value={company}
                            onChange={(e) => this.setState({company: e.target.value.trimStart()})} />

                        <div className="input-group-append" style={{ display: 'flex'}}>
                            <span className="input-group-text" onClick={(e) => this.setState({company: "", currdata: null, tableload:false})}>
                                <img src={Cancel} alt='' width={20} />
                            </span>
                            {
                                (currdata || !data.length) &&
                                <span className="input-group-text" onClick={(e) => {
                                    if(currdata)
                                        this.edit();
                                    else 
                                        this.save();
                                }}>
                                    <img src={Save} alt='' width={20} />
                                </span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    SearchBox() {
        const {searchinput} = this.state;
        return(
            <div className='container w-50 justiy-content-center'>
                <div className="input-group">
                    <div classnName="input-group-prepend" style={{ display: 'flex'}}>
                        <span className="input-group-text" onClick={(e) => this.filter()}>
                            <img src={Search} alt='' width={20} />
                        </span>
                    </div>

                    <input type="text" 
                        className="form-control" 
                        placeholder='Search'
                        value={searchinput}
                        onChange={(e) => this.setState({searchinput: e.target.value.trimStart()})} />

                    <div className="input-group-append" style={{ display: 'flex'}}>
                        <span className="input-group-text" onClick={(e) => this.setState({searchinput: ""}, () => this.loadTable())}>
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
                    <td>{el.company}</td>
                    <td 
                        style={{color: 'blue', fontSize: 13, cursor:"pointer"}}
                        onClick={(e) => {
                            document.getElementById("company-input").focus();
                            this.setState({
                                company: el.company,
                                currdata: {company: el.company},
                                tableload: true
                            })
                        }}>
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
                <div className='container w-75 justfiy-content-center'>
                    <table className="table mt-3 table-hover">
                        <thead className="table-dark">
                            <this.THead data={["SNo", "Company Name", "Edit"]} />
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
                <this.TopSection />
                <div className='shadow p-3 m-3 bg-white rounded'>
                    {/* <this.SearchBox />   */}
                    <this.Table />
                </div>
            </div>
        );
    }
}

export default CompanyName;