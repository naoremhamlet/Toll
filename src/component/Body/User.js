import React, { Component } from 'react';
import Save from '../../assets/save.svg';
import Cancel from '../../assets/cancel.svg';
import Search from '../../assets/search.svg';
import Edit from '../../assets/edit.svg';
import axios from 'axios';

const APP_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class Users extends Component {

    constructor(props) {
        super(props);

        this.state ={
            name: "",
            lane: "",
            toll: "",
            pass: "",
            empcode: "",
            searchinput: "",
            data: [],
            tableload: true,
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
        this.loadTable();
    }

    loadTable() {
        axios.get(`${APP_URL}/user/fetch`).then(res => {
            if(res.data.success) {
                this.setState({data:res.data.data, tableload: false})
            }
        }).catch(err => console.log(err));
    }

    filter() {
        const {searchinput} = this.state;
        if(searchinput.trim().length > 0) {
            this.setState({tableload:true});
            axios.get(`${APP_URL}/user/fetch?searchinput=${searchinput}`).then(res => {
                if(res.data.success) {
                    this.setState({data:res.data.data, tableload: false})
                }
            }).catch(err => console.log(err));
        }
    }

    save() {
        const {name,pass, empcode, lane, toll} = this.state;

        document.getElementById('name-input').style.border = "";
        document.getElementById('pass-input').style.border = ""; 
        document.getElementById('empcode-input').style.border = "";
        document.getElementById('toll-input').style.border = "";
        document.getElementById('lane-input').style.border = "";

        if(name.trim().length > 0) {
            if(pass.trim().length > 3) {
                if(empcode.trim().length > 0) {
                    if(toll.trim().length > 0) {
                        if(lane.trim().length > 0) {
                            axios.post(`${APP_URL}/user/add`, {name: name.trim(),pass:pass.trim(),empcode:empcode.trim(), toll: toll.trim(), lane: lane.trim()}).then(res => {
                                if(res.data.success){
                                    this.setState({tableload: true, name:"",pass:"",empcode:"",lane:"",toll:""}, () => this.loadTable());
                                }
                            }).catch(err => console.log(err));
                        } else {
                            document.getElementById('lane-input').style.border = "solid 2px red";
                        }
                    } else {
                        document.getElementById('toll-input').style.border = "solid 2px red";
                    }
                } else {
                    document.getElementById('empcode-input').style.border = "solid 2px red";
                }
            } else {
                document.getElementById('pass-input').style.border = "solid 2px red";
            }
        } else {
            document.getElementById('name-input').style.border = "solid 2px red";
        }

    }

    edit() {
        const {name,pass, empcode, lane, toll, currdata} = this.state;

        document.getElementById('name-input').style.border = "";
        document.getElementById('pass-input').style.border = ""; 
        document.getElementById('empcode-input').style.border = "";
        document.getElementById('toll-input').style.border = "";
        document.getElementById('lane-input').style.border = "";

        if(name.trim().length > 0) {
            if(pass.trim().length > 3) {
                if(empcode.trim().length > 0) {
                    if(toll.trim().length > 0) {
                        if(lane.trim().length > 0) {
                            axios.post(`${APP_URL}/user/edit`, {name: name.trim(),pass:pass.trim(),empcode:empcode.trim(), toll: toll.trim(), lane: lane.trim(), currdata}).then(res => {
                                if(res.data.success){
                                    this.setState({tableload: true, name:"",pass:"",empcode:"",lane:"", toll:"", currdata:null}, () => {
                                        this.loadTable();
                                    });
                                }
                            }).catch(err => console.log(err));
                        } else {
                            document.getElementById('lane-input').style.border = "solid 2px red";
                        }
                    } else {
                        document.getElementById('toll-input').style.border = "solid 2px red";
                    }
                } else {
                    document.getElementById('empcode-input').style.border = "solid 2px red";
                }
            } else {
                document.getElementById('pass-input').style.border = "solid 2px red";
            }
        } else {
            document.getElementById('name-input').style.border = "solid 2px red";
        }
    }


    TopSection() {
        const {name, pass, empcode, toll, lane, currdata} = this.state;
        return (
            <div className='shadow p-3 m-3 bg-white rounded'>
                <div className='container w-75'>
                    <div className="input-group">
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">User Name</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            placeholder='Enter User Name'
                            id='name-input'
                            value={name}
                            onChange={(e) => this.setState({name: e.target.value.trimStart()})} />

                        <div classnName="input-group-prepend">
                            <span className="input-group-text">Password</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            placeholder='Enter Password'
                            id='pass-input'
                            value={pass}
                            onChange={(e) => this.setState({pass: e.target.value.trimStart()})} />

                        <div classnName="input-group-prepend">
                            <span className="input-group-text">Emp Code</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            placeholder='Enter Emp Code'
                            id='empcode-input'
                            value={empcode}
                            onChange={(e) => this.setState({empcode: e.target.value.trimStart()})} />

                        <div classnName="input-group-prepend">
                            <span className="input-group-text">Toll</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            placeholder='Enter Toll'
                            id='toll-input'
                            value={toll}
                            onChange={(e) => this.setState({toll: e.target.value.trimStart()})} />

                        <div classnName="input-group-prepend">
                            <span className="input-group-text">Lane</span>
                        </div>

                        <input type="text" 
                            className="form-control" 
                            placeholder='Enter Lane'
                            id='lane-input'
                            value={lane}
                            onChange={(e) => this.setState({lane: e.target.value.trimStart()})} />

                        <div className="input-group-append" style={{ display: 'flex'}}>
                            <span className="input-group-text" onClick={(e) => this.setState({name:"",pass:"",empcode:"",toll:"",lane:"",currdata:null, tableload:false})}>
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
                    <td>{el.name}</td>
                    <td>{el.pass}</td>
                    <td>{el.empcode}</td>
                    <td>{el.toll}</td>
                    <td>{el.lane}</td>
                    {el.name.toLowerCase()!=="admin" &&
                     <td 
                        style={{color: 'blue', fontSize: 13, cursor:"pointer"}}
                        onClick={() => {
                            document.getElementById("name-input").focus();
                            this.setState({
                                name:el.name,
                                pass:el.pass,
                                empcode:el.empcode,
                                toll:el.toll,
                                lane:el.lane,
                                currdata:{name:el.name,pass:el.pass,empcode:el.empcode,toll:el.toll,lane:el.lane},
                                tableload: true,
                            })
                        }}
                     >
                        <img src={Edit} width={12} alt='' /> Edit
                    </td>}
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
                            <this.THead data={["SNo", "User","Pass","Emp Code", "Toll", "Lane", "Edit"]} />
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

export default Users;