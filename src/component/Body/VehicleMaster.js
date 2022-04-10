import React, { Component } from 'react';
import Save from '../../assets/save.svg';
import Cancel from '../../assets/cancel.svg';
import Search from '../../assets/search.svg';
import Edit from '../../assets/edit.svg';
import axios from 'axios';

const APP_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class VehicleMaster extends Component {

    constructor(props) {
        super(props);

        this.state = {
            v_wt: "",
            v_type: "",
            searchinput: "",
            data: [],
            tableload: true,
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
        axios.get(`${APP_URL}/vehiclemaster/fetch`).then(res => {
            if(res.data.success) {
                this.setState({data:res.data.data, tableload: false})
            }
        }).catch(err => console.log(err)) 
    }

    filter() {
        const {searchinput} = this.state;

        if(searchinput.trim().length > 0) {
            this.setState({tableload:true});
            axios.get(`${APP_URL}/vehiclemaster/fetch?searchinput=${searchinput}`).then(res => {
                if(res.data.success) {
                    this.setState({data:res.data.data, tableload: false})
                }
            }).catch(err => console.log(err)) 
        }
    }

    save() {
        const {v_wt, v_type} = this.state;

        document.getElementById('v_type-input').style.border = "";
        document.getElementById('v_wt-input').style.border = "";

        if(v_type.trim().length > 0) {
            if(!isNaN(v_wt) && parseInt(v_wt) > 0) {

                axios.post(`${APP_URL}/vehiclemaster/add`, {v_type: v_type.trim(), v_wt: parseInt(v_wt).toString()}).then(res => {
                    if(res.data.success) {
                        this.setState({tableload: true, v_type:"",v_wt:""}, () => this.loadTable())
                    }
                }).catch(err => console.log(err));

            } else {
                document.getElementById('v_wt-input').style.border = "solid 2px red";
            }
        } else {
            document.getElementById('v_type-input').style.border = "solid 2px red";
        }

    }

    edit() {
        const {v_wt, v_type, currdata} = this.state;

        document.getElementById('v_type-input').style.border = "";
        document.getElementById('v_wt-input').style.border = "";

        if(v_type.trim().length > 0) {
            if(!isNaN(v_wt) && parseInt(v_wt) > 0) {

                axios.post(`${APP_URL}/vehiclemaster/edit`, {v_type: v_type.trim(), v_wt: parseInt(v_wt).toString(), currdata}).then(res => {
                    if(res.data.success) {
                        this.setState({tableload: true, v_type:"",v_wt:"", currdata:null}, () => this.loadTable())
                    }
                }).catch(err => console.log(err));

            } else {
                document.getElementById('v_wt-input').style.border = "solid 2px red";
            }
        } else {
            document.getElementById('v_type-input').style.border = "solid 2px red";
        }

    }

    TopSection() {
        const {v_type, v_wt, currdata} = this.state;
        return (
            <div className='shadow p-3 m-3 bg-white rounded'>
                <div className='container w-75'>
                    <div className="input-group">
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">New Vehicle Type</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            id='v_type-input'
                            placeholder='Enter Vehicle Type'
                            value={v_type}
                            onChange={(e) => this.setState({v_type: e.target.value.trimStart()})} />

                        <div classnName="input-group-prepend">
                            <span className="input-group-text">Vehicle Weight(kg)</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            placeholder='Enter Vehicle Weight'
                            id='v_wt-input'
                            value={v_wt}
                            onChange={(e) => this.setState({ v_wt: e.target.value.trim()})} />

                        <div className="input-group-append" style={{ display: 'flex'}}>
                            <span className="input-group-text" onClick={(e) => this.setState({v_type: "", v_wt: "", currdata:null, tableload:false})}>
                                <img src={Cancel} alt='' width={20} />
                            </span>
                            <span className="input-group-text" onClick={(e) => {
                                if(currdata)
                                    this.edit();
                                else
                                    this.save()
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
                        onChange={(e) => this.setState({ searchinput: e.target.value.trimStart()})} />

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
                    <td>{el.v_type}</td>
                    <td>{el.v_wt}</td>
                    <td 
                        style={{color: 'blue', fontSize: 13, cursor:"pointer"}}
                        onClick={(e) => {
                            document.getElementById("v_type-input").focus();
                            this.setState({
                                v_type:el.v_type,
                                v_wt:el.v_wt,
                                currdata:{v_type:el.v_type, v_wt:el.v_wt},
                                tableload:true
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
                            <this.THead data={["SNo", "Vehicle Type", "Vehicle Weight", "Edit"]} />
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

export default VehicleMaster;