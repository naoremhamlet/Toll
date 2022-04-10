import React, { Component } from 'react';
import Save from '../../assets/save.svg';
import Cancel from '../../assets/cancel.svg';
import Search from '../../assets/search.svg';
import Edit from '../../assets/edit.svg';
import axios from 'axios';

const APP_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class TollPlazaFeeRules extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            amount: "",
            v_type: "",
            j_type: "",
            vehicles: [],
            journeys: [],
            tableload: true,
            searchinput: "",
            data: [],
            currdata:null,
        }

        this.TopSection = this.TopSection.bind(this);
        this.SelectBox = this.SelectBox.bind(this);
        this.SearchBox = this.SearchBox.bind(this);
        this.Table = this.Table.bind(this);
        this.THead = this.THead.bind(this);
        this.TBody = this.TBody.bind(this);
        this.save = this.save.bind(this);
        this.filter = this.filter.bind(this);
        this.edit = this.edit.bind(this);
        this.loadTabel = this.loadTable.bind(this);
    }

    componentDidMount() {
        axios.get(`${APP_URL}/vehiclemaster/fetch`).then(res => {
            if(res.data.success) {
                const vehicles = res.data.data.map(el => el.v_type);
                axios.get(`${APP_URL}/journeymaster/fetch`).then(d => {
                    if(d.data.success) {
                        const journeys = d.data.data.map(el => el.j_type);

                        this.setState({vehicles, journeys});
                    }
                })
            }
        }).catch(err => console.log(err))
        this.loadTable();
    }

    loadTable() {
        axios.get(`${APP_URL}/tollplazafeerules/fetch`).then(res => {
            if(res.data.success) {
                this.setState({data:res.data.data, tableload: false})
            }
        }).catch(err => console.log(err));
    }

    filter() {
        const {searchinput} = this.state;
        if(searchinput.trim().length > 0) {
            this.setState({tableload: true});
            axios.get(`${APP_URL}/tollplazafeerules/fetch?searchinput=${searchinput}`).then(res => {
                if(res.data.success) {
                    this.setState({data:res.data.data, tableload: false})
                }
            }).catch(err => console.log(err));
        }
    }

    save() {
        const {v_type, j_type, amount} = this.state;

        document.getElementById('v_select').style.border = "";
        document.getElementById('j_select').style.border = "";
        document.getElementById('amount_input').style.border = "";

        if(v_type.length>0) {
            if(j_type.length>0) {
                if(!isNaN(amount) && parseInt(amount)>0) {
                    axios.post(`${APP_URL}/tollplazafeerules/add`, {v_type, j_type, amount: parseInt(amount).toString()}).then(res => {
                        if(res.data.success) {
                            this.setState({tableload: true, v_type:"", j_type:"",amount:""}, () => this.loadTable());
                        }
                    }).catch(err => console.log(err)) 
                } else {
                    document.getElementById('amount_input').style.border = "solid 2px red";
                }
            } else {
                document.getElementById('j_select').style.border = "solid 2px red";
            }
        } else {
            document.getElementById('v_select').style.border = "solid 2px red";
        }
    }

    edit() {
        const {v_type, j_type, amount, currdata} = this.state;

        document.getElementById('v_select').style.border = "";
        document.getElementById('j_select').style.border = "";
        document.getElementById('amount_input').style.border = "";

        if(v_type.length>0) {
            if(j_type.length>0) {
                if(!isNaN(amount) && parseInt(amount)>0) {
                    axios.post(`${APP_URL}/tollplazafeerules/edit`, {v_type, j_type, amount: parseInt(amount).toString(), currdata}).then(res => {
                        if(res.data.success) {
                            this.setState({tableload: true, v_type:"", j_type:"",amount:"", currdata:null}, () => this.loadTable());
                        }
                    }).catch(err => console.log(err)) 
                } else {
                    document.getElementById('amount_input').style.border = "solid 2px red";
                }
            } else {
                document.getElementById('j_select').style.border = "solid 2px red";
            }
        } else {
            document.getElementById('v_select').style.border = "solid 2px red";
        }
    }

    SelectBox({data, placeholder, id_name}) {
        const {v_type, j_type} = this.state; 
        return(
            <select class="form-select" 
                id={id_name}
                onChange={(e) => {
                    if(placeholder==="Select Vehicle Type")
                        this.setState({v_type: e.target.value})
                    else if(placeholder==="Select Journey Type")
                        this.setState({j_type: e.target.value})

            }}>
                <option selected hidden>{placeholder}</option>
                {data.map(el =>(
                    el===v_type||el===j_type? 
                    <option selected value={el}>{el}</option> : <option value={el}>{el}</option>
                ))}
            </select>
        )
    }

    TopSection() {
        const {vehicles, journeys, amount, currdata} = this.state;
        return (
            <div className='shadow p-3 m-3 bg-white rounded'>
                <div className='container w-75'>
                    <div className="input-group">
                        <div classnName="input-group-prepend">
                            <span className="input-group-text">New Toll Fee</span>
                        </div>
                            <this.SelectBox 
                                data={vehicles}
                                id_name={"v_select"}
                                placeholder={"Select Vehicle Type"} />
                            <this.SelectBox 
                                data={journeys}
                                id_name={"j_select"}
                                placeholder={"Select Journey Type"} />

                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder='Enter Amount'
                            value={amount}
                            id='amount_input'
                            onChange={(e) => this.setState({amount: e.target.value.trim()})} />

                        <div className="input-group-append" style={{ display: 'flex'}}>
                            <span className="input-group-text"
                                onClick={(e) => this.setState({ amount:"", v_type: "", j_type: "", currdata:null, tableload:false})}>
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
            <div className='container w-50 justify-content-center'>
                <div className="input-group">
                    <div classnName="input-group-prepend" style={{ display: 'flex'}}>
                        <span className="input-group-text" onClick={() => this.filter()}>
                            <img src={Search} alt='' width={20} />
                        </span>
                    </div>
                    <input type="text" 
                        className="form-control" 
                        placeholder='Search'
                        value={searchinput}
                        onChange={(e) => this.setState({ searchinput: e.target.value.trim()})} />

                    <div className="input-group-append" style={{ display: 'flex'}}>
                        <span className="input-group-text" onClick={(e) => this.setState({ searchinput: ""}, () => this.loadTable())}>
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
                    <td>{el.j_type}</td>
                    <td>{el.amount}</td>
                    <td 
                        style={{color: 'blue', fontSize: 13, cursor:"pointer"}}
                        onClick={() => {
                            document.getElementById("amount_input").focus();
                            this.setState({
                                v_type: el.v_type,
                                j_type: el.j_type,
                                amount: el.amount,
                                currdata: {v_type: el.v_type, j_type:el.j_type, amount:el.amount},
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
                <div className='container w-50 justify-content-center'>
                    <table className="table mt-3 table-hover">
                        <thead className="table-dark">
                            <this.THead data={["SNo", "Vehicle Type", "Journey Type", "Amount", "Edit"]} />
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

export default TollPlazaFeeRules;