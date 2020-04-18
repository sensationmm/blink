import React from 'react';
import styled from "styled-components";
import arrow from '../../svg/Menu-select.png'
import { Link } from 'react-router-dom';
import david from '../../svg/david_brear.jpg';

const Avatar = styled.div`
    height: 80px;
    width: 80px;
    border-radius: 50%;
    border: 1px solid #333;
    background-color: #ccc;
    margin: 0 auto 10px;
    background: url(${david});
    background-position: 0;
    background-size: cover;
    background-repeat: no-repeat;
`

const MenuSt = styled.div`
  
  width: 200px;
  height: 100vh;
  float: left;
  z-index: 1;
  position: relative;

   ul {
    width: 200px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #eee;
    margin: 0;
    padding: 20px 0 0;

    li {
      list-style-type: none;
      margin: 0;
      position: relative; 
      padding: 0;
      a {
        padding: 10px 20px 10px 40px;
        text-decoration: none;
        color: initial;
        display: block;

        &:hover, &.active {
          text-decoration: underline;
          color: var(--brand-secondary);
          &::before {
            content: "";
            position: absolute;
            height: 40px;
            width: 30px;
            left: 10px;
            top: -10px;
            background: url(${arrow});
            background-position: 0;
            background-size: cover;
            background-repeat: no-repeat;
          }
        } 
      }
      &.user {
          margin: 20px 0 50px;
          text-align: center;
      }
    }
}
`
const Menu = (props: any) => {
    return <MenuSt>
        <ul>
            <li className="user">
                <Avatar />
                {props.userName}
            </li>
            <li><Link to="/integrations">Dashboard</Link></li>
            <li><Link 
                className={props.path === "accounts" ? "active" : ""} 
                to="/integrations/accounts">Accounts</Link></li>
            <li><Link className={props.path === "tax" ? "active" : ""} 
            to="/integrations/tax">Tax</Link></li>
            <li><Link 
                className={props.path === "integrations" ? "active" : ""} 
                to="/integrations">Integrations</Link></li>
            <li><Link to="/integrations">Funding</Link></li>
            <li><Link to="/integrations">Settings</Link></li>
            <li><Link onClick={props.userSignout} to="/">Logout</Link></li>
        </ul>
    </MenuSt>

}

export default Menu