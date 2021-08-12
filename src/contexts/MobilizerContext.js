import React, { createContext, useReducer,useContext } from "react";
import mobilizerReduce from "../reducers/mobilizerReducer";
import * as Service from "../services/mobilizer";
import * as AidService from "../services/aid";
import ACTION from "../actions/mobilizer";
import {AppContext} from './AppSettingsContext';

const initialState = {
  list: [],
  pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
  aid: "",
  aids: [],
  mobilizer: {},
  loading: false,
  transactionHistory: [],
};

export const MobilizerContext = createContext(initialState);
export const MobilizerContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mobilizerReduce, initialState);
  const {wallet,appSettings,changeIsverified} = useContext(AppContext);

  async function getMobilizerBalance(contract_addr, wallet_address) {
    return Service.getMobilizerBalance(contract_addr, wallet_address);
  }

  async function listAid() {
    const d = await AidService.listAid({ start: 0, limit: 20 });
    dispatch({ type: ACTION.LIST_AID, data: { aids: d.data } });
  }

  function setAid(aid) {
    dispatch({ type: ACTION.SET_AID, data: aid });
  }

  function clear() {
    dispatch({
      type: ACTION.LIST,
      data: {
        limit: 10,
        start: 0,
        total: 0,
        data: [],
        page: 0,
        name: "",
        phone: "",
      },
    });
  }

  async function approveMobilizer( payload) {
    const { rahat:rahatContractAddr } = appSettings.agency.contracts;
    const res = await Service.approveMobilizer(wallet,payload,rahatContractAddr);
    changeIsverified(false);
    if (res) {
      setMobilizer(res.data);
      return res.data;
    }
  }

  async function changeMobilizerStatus(mobilizerId, status) {
    const res = await Service.changeMobilizerStaus(mobilizerId, status);
    setMobilizer(res.data);
    return res.data;
  }

  function setMobilizer(b) {
    dispatch({ type: ACTION.SET_MOBILIZER, data: b });
  }

  async function getMobilizerDetails(id) {
    const data = await Service.get(id);
    setMobilizer(data);
    return data;
  }

  function addMobilizer(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      wallet_address: formData.get("ethaddress"),
      email: formData.get("email"),
      address: formData.get("address"),
      govt_id: formData.get("govt_id"),
      organization:formData.get("organization")
    };

    return new Promise((resolve, reject) => {
      Service.add(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function setLoading() {
    dispatch({ type: ACTION.SET_LOADING });
  }

  function resetLoading() {
    dispatch({ type: ACTION.RESET_LOADING });
  }

  async function listMobilizer(params) {
    console.log("listing MOB");
    let res = await Service.list(params);
    if (res) {
      dispatch({
        type: ACTION.LIST,
        data: res,
      });
      return res;
    }
  }

  async function getMobilizerTransactions(mobilizerId) {
    let res = await Service.mobilizerTransactions(mobilizerId);
    if (res) {
      dispatch({
        type: ACTION.MOBILIZER_TX,
        data: res,
      });
      return res;
    }
  }

  return (
    <MobilizerContext.Provider
      value={{
        list: state.list,
        aid: state.aid,
        aids: state.aids,
        mobilizer: state.mobilizer,
        loading: state.loading,
        pagination: state.pagination,
        transactionHistory: state.transactionHistory,
        listMobilizer,
        listAid,
        setAid,
        clear,
        addMobilizer,
        setMobilizer,
        setLoading,
        resetLoading,
        approveMobilizer,
        getMobilizerDetails,
        changeMobilizerStatus,
        getMobilizerBalance,
        getMobilizerTransactions,
      }}
    >
      {children}
    </MobilizerContext.Provider>
  );
};