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

    ul {
      height: auto;
      position: relative;
      padding: 0;
      font-size: 12px;

      li {
        padding: 0px 0px 0px 10px;
      }
    }

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
      <li className="user"><Avatar />{props.userName}</li>
      <li><Link className={props.path === undefined ? "active" : ""} to="/my-profile">Dashboard</Link></li>
      <li><Link className={props.path === "accounts" ? "active" : ""} to="/my-profile/accounts">Accounts</Link>
        {props.path === 'accounts' &&
          <ul>
            <li><Link className={props.section === "connect-banks" ? "active" : ""} to="/my-profile/accounts/connect-banks">Connect banks</Link> </li>
            <li><Link className={props.section === "make-a-payment" ? "active" : ""} to="/my-profile/accounts/make-a-payment">Payments</Link> </li>
          </ul>
        }
      </li>
      <li><Link className={props.path === "tax" ? "active" : ""}
        to="/my-profile/tax">Tax</Link>
        {(props.path === "tax" || props.path === "tax-planning" || props.path === "local-tax-partners") && <ul>
          <li>
            <Link className={props.section === "tax-planning" ? "active" : ""}
              to="/my-profile/tax/tax-planning">Tax planning</Link>
          </li>
          <li>
            <Link className={props.section === "local-tax-partners" ? "active" : ""}
              to="/my-profile/tax/local-tax-partners">Local tax partners</Link>
          </li>
        </ul>
        }

      </li>
      <li><Link className={(props.path === "integrations" || props.path === "xero") ? "active" : ""} to="/my-profile/integrations">Integrations</Link></li>
      <li><Link to="/my-profile/funding" className={props.path === "funding" ? "active" : ""}>Funding</Link></li>
      <li><Link to="/my-profile/settings" className={props.path === "settings" ? "active" : ""} >Settings</Link>
        {props.path === 'settings' &&
          <ul>
            <li><Link className={props.section === "general" ? "active" : ""} to="/my-profile/settings/general">General</Link> </li>
            <li><Link className={props.section === "users" ? "active" : ""} to="/my-profile/settings/users">Users</Link> </li>
          </ul>
        }
      </li>
      <li><Link onClick={props.userSignout} to="/">Logout</Link></li>
      <li><Link className={props.path === "integration-demo" ? "active" : ""} to="/my-profile/integration-demo">Integration Demo</Link></li>
    </ul>
  </MenuSt>

}

export default Menu