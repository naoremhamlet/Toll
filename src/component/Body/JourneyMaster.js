import React, { Component } from 'react';
import Save from '../../assets/save.svg';
import Cancel from '../../assets/cancel.svg';
import Search from '../../assets/search.svg';
import Edit from '../../assets/edit.svg';
import axios from 'axios';

const APP_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class JourneyMaster extends Component {

    constructor(props) {
        super(props);

        this.state = {
            j_type: "",
            searchinput: "",
            tableload: true,
            data: [],
            currdata: null,
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
        axios.get(`${APP_URL}/journeymaster/fetch`).then(res => {
            if(res.data.success) {
                this.setState({data:res.data.data, tableload: false})
            }
        }).catch(err => console.log(err));
    }

    filter() {
        const {searchinput} = this.state;
        if(searchinput.trim().length > 0){
            this.setState({tableload:true})
            axios.get(`${APP_URL}/journeymaster/fetch?searchinput=${searchinput.trim()}`).then(res => {
                if(res.data.success) {
                    this.setState({data:res.data.data, tableload: false})
                }
            }).catch(err => console.log(err));
        }

    }

    save() {
        const {j_type} = this.state;
        document.getElementById("journey-input").style.border = "";
        if(j_type.trim().length > 0) {
            axios.post(`${APP_URL}/journeymaster/add`, {j_type: j_type.trim()}).then(res => {
                if(res.data.success) {
                    this.setState({tableload: true, j_type:""}, () => this.loadTable());
                }
            })
        } else {
            document.getElementById("journey-input").style.border = "solid 2px red";
        }

    }

    edit() {
        const {j_type, currdata} = this.state;
        document.getElementById("journey-input").style.border = "";
        if(j_type.trim().length > 0) {
            axios.post(`${APP_URL}/journeymaster/edit`, {j_type: j_type.trim(), currdata}).then(res => {
                if(res.data.success) {
                    this.setState({tableload: true, j_type:"", currdata:null}, () => this.loadTable())
                }
            })
        } else {
            document.getElementById("journey-input").style.border = "solid 2px red";
        }
    }

    TopSection() {
        const {j_type, currdata} = this.state;
        return (
            <div className='shadow p-3 m-3 bg-white rounded'>
                <div className='container w-50'>
                    <div className="input-group">
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">New Journey Type</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            placeholder='Enter Journey Type'
                            id='journey-input'
                            value={j_type}
                            onChange={(e) => this.setState({j_type: e.target.value.trimStart()})} />

                        <div className="input-group-append" style={{ display: 'flex'}}>
                            <span className="input-group-text" onClick={(e) => this.setState({j_type: "", currdata:null, tableload:false})}>
                                <img src={Cancel} alt='' width={20} />
                            </span>
                            <span className="input-group-text" onClick={(e) => {
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
                    <td>{el.j_type}</td>
                    <td 
                        style={{color: 'blue', fontSize: 13, cursor:"pointer"}}
                        onClick={(e) => {
                            document.getElementById("journey-input").focus();
                            this.setState({
                                j_type: el.j_type,
                                currdata:{j_type:el.j_type},
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
                <div className='container w-50 justfiy-content-center'>
                    <table className="table mt-3 table-hover">
                        <thead className="table-dark">
                            <this.THead data={["SNo", "Journey Type", "Edit"]} />
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

export default JourneyMaster;