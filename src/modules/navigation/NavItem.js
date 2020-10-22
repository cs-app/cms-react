import React, {Component} from "react";
import {Link, Router} from 'react-router-dom';
import PropTypes from 'prop-types';
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

class NavItem extends Component {

    constructor() {
        super();
        this.state = {
            navigation: [
                {name: "Profile", path: "/employee"},
                {name: "Cuti", path: "/cuti"},
                {name: "Promosi", path: "/promosi"},
                {name: "Pensiun", path: "/pensiun"},
                {name: "Proyeksi Gaji", path: "/proyeksi_gaji"},
            ]
        }
    }

    menuTemplate(item, index) {
        // var isActive = this.props.location.pathname === this.props.to
        // var className = isActive ? 'active' : ''
        return (
            <li className="nav-item" key={index}>
                <Link className="nav-link" to={item.path}>
                    <i className="menu-icon mdi mdi-television"/> <span className="menu-title menu-title-nav">{item.name}</span>
                </Link>
            </li>
        );
    }

    render() {
        return (
            <>
                {
                    this.state.navigation.map((item, index) => {
                        return this.menuTemplate(item, index);
                    })
                }
            </>

        );
    }
}

NavItem.contextTypes = {
    router: PropTypes.object
};

export default NavItem;