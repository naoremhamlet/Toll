import React, { Component } from 'react';

class Header extends Component {

    
    
    NavBarItem({data, setActive, active}) {
        return(
            <ul className='navbar-nav'>
                {data.map(el => (
                    <li className="nav-item active">
                        <p className='navbar-text h7 p-3' 
                            style={{fontWeight: 600,color: el.split(' ').join('').toLowerCase()===active? "#ffffff":""}}
                            role={"button"} 
                            onClick={()=>setActive(el.split(' ').join('').toLowerCase())}
                        >
                            {el}
                        </p>
                    </li>
                ))}
            </ul>
        )
    }


    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <p className="navbar-brand p-3" style={{fontSize: 25}}>Toll</p>
                <div className="collapse navbar-collapse">
                    <this.NavBarItem 
                        setActive={this.props.setActive}
                        active={this.props.active}
                        data={["Booth Transaction", "Booth Master", "Company Name", "Toll Name", 
                            "Journey Master", "Vehicle Master", "Toll Plaza Fee Rules", "Users"]} />
                </div>
            </nav>
        );
    }
}

export default Header;