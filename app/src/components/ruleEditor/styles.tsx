import styled from "styled-components";
import EditIcon from "../../svg/icon-edit.svg"
import { InputSt } from '../styles';

export const RulesList = styled.ul`
  
padding: 0;
background-color: #fff;
clear: both;

  li {
    list-style-type: none;
    padding: 0;
    border: 1px solid #D5D4D4;
    // border-bottom: 0;
    &::last-child {
      border: 1px solid #D5D4D4;
    }
    margin-bottom: -1px;

    &:hover {
      border-color: var(--brand-secondary);
      z-index: 1;
      position: relative;
    }
  }

  label {
    display: block; 
    width: calc(100% - 130px);
    padding: 15px 65px;
    text-align: center;
    display: flex;
    align-items: center;
  }

  b {
    color: var(--brand-secondary); 
  }
`

export const ContentNarrowInner = styled.div`
  padding: 20px;
`

export const Name = styled.span`
  display: block;
  font-size: 12px;
  margin-left: 50px;
`

export const CollectionFilter = styled.div`
  font-size: 12px;
  display: flex;
  label {
    display: flex;
    align-items: center;
    padding-left: 30px;
  }
  .person, .company {
    height: 22px;
    width: 22px
  }

  span {
      padding: 0 8px;
  }
`

export const Search = styled.input`
  border: none;
  background: none;
  border-bottom: 1px solid #999;
  padding: 10px 5px;
  outline: none;
  margin: 0 0 10px;
  width: 500px;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    margin: 20px 0;
  }
`

export const Markets = styled.ul`
  display: flex;
  margin: 0;

  li {
    list-style-type: none;
    padding: 0 10px;

    label {
      display: flex;
      align-items: center;

      input {
        margin: 0 5px;
      }
    }

    &.coreSelected {
      opacity: 0.3;
      &:hover {
        opacity: 1;
      }
    }

    img {
      height: 15px;
      width: 15px;
      margin: 0 5px;
    }
  }
`

export const Policies = styled.ul`
  width: 100%;
  li {
    list-style-type: none;
    padding: 0 10px;
    display: flex;
    align-items: center;
    
    img {
      margin-right: 50px;
    }
    span {
      min-width: 300px;
      display: flex;
      align-items: center;
    }
`

export const CheckBox = styled.input`
  appearance: unset;
  border: 1px solid var(--brand-secondary);
  padding: 6px;
  border-radius: 50%;
  position: relative;
  outline: none;

  &:checked::after {
    content: "";
    position: absolute;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: var(--brand-secondary);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

export const Title = styled(InputSt)`
  max-width: 500px;
  border-color: transparent;
  text-align: center;
  margin-bottom: 0px;
  &:focus {
    border-color: var(--basic-shadow);
  }
`

export const Description = styled(Title)`
  color: #979797;
  font-size: 14px;
`;

export const Heading = styled.span`
  font-size: 12px;
  font-weight: bold;
  padding-top: 20px;
`

export const Edit = styled.button`
  background-image: url(${EditIcon});
  background-repeat: no-repeat;
  background-color: none;
  border: none;
  height: 20px;
  width: 20px;
  position: absolute;
  right: 40px;
`
export const Code = styled(Policies)``