import React, {useEffect, useState} from 'react'
import {Button, Form, Label, Container, Confirm,Progress} from 'semantic-ui-react'
import './App.css';
import contract from './contracts/abi.json';
import { ethers } from 'ethers';


const contractAddress = "0xa00312095A9019F1A5E12401701B21037D736290";
const abi = contract;


function App() {

    const [percent, setPercent] = useState(0)
    const [open,setOpen]=useState(false)
    const [currentAccount, setCurrentAccount] = useState(null);
    const [moneyRequire,setMoneyRequire] = useState('');
    const [firstname,setFirstnameRequire] = useState('');
    const [lastname,setLastnameRequire] = useState('');
    const [detailRequire,setDetailRequire] = useState('');
    const [email,setEmailRequire] = useState('');

    const toggle=(a)=>{
        setPercent(percent+a);
    }
    const changeOpen=()=>{
        setOpen(true);
    }

    const changeClose=()=>{
        setOpen(false);
    }

    const checkWalletIsConnected = async () => {
        const {ethereum}=window;
        if(!ethereum){
            console.log("Make sure you have Metamask!");
            return
        }else {
            console.log("Wallet found!");
        }
        const accounts =await ethereum.request({method:'eth_requestAccounts'});
        if(accounts.length !==0){
            const account = accounts[0];
            console.log("Found an authorized account",account);
            setCurrentAccount(account);
        }else {
            console.log("No authorized account");
        }

    }
    const connectWalletHandler = async () => {
        const {ethereum}=window;
        if(!ethereum){
            alert("Please install Metamask!");
        }
        try {
            const accounts =await ethereum.request({method:'eth_requestAccounts'});
            console.log("Found an account!Address:",accounts[0]);
            setCurrentAccount(accounts[0]);
        }catch (err){
            console.log(err);
        }
    }


    const createDonate= async()=>{
        try {
            const {ethereum}=window;
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const Contract = new ethers.Contract(contractAddress, abi, signer);
                console.log("Initialize payment");
                const accounts =await ethereum.request({method:'eth_requestAccounts'});
                const account = accounts[0];
                let nftTxn =await Contract.NewNeeder(account,moneyRequire,detailRequire,firstname,lastname,email);
                console.log(nftTxn);
                console.log("Please wait");
                await nftTxn.wait() ;
                toggle(100);
                changeOpen()
                console.log("Successful");

            }
        }catch (err){
            console.log(err);
        }

    }
    const moneyMessageChange = ( e ) => {
        setMoneyRequire(e.target.value );
    };

    const detailMessageChange=(e)=>{
        setDetailRequire(e.target.value);
    }
    const firstnameMessageChange=(e)=>{
        setFirstnameRequire(e.target.value);
    }

    const lastnameMessageChange=(e)=>{
        setLastnameRequire(e.target.value);
    }

    const emailMessageChange =(e)=>{
        setEmailRequire(e.target.value);
    }

    const mintNftButton = () => {
        return (
            <button className='cta-button mint-nft-button'>
            </button>
        )
    }

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])


    return (
        <div className={"abc"}>
            <Form success >
                <Container>
                    <div>
                        {currentAccount ? mintNftButton() : connectWalletButton()}
                    </div>
                </Container>
                <Form.Group widths='equal' >
                    <Form.Input value={firstname} onChange={firstnameMessageChange} label='First name'  />
                    <Form.Input value={lastname}  onChange={lastnameMessageChange} label='Last name'  />
                </Form.Group>
                <Form.TextArea label='Detail' placeholder='Tell us more about the project...' value={detailRequire} onChange={detailMessageChange}/>
                <Form.Input labelPosition='right' type='text' placeholder='Amount'>
                    <Label basic>eth</Label>
                    <input type="number" placeholder="Please enter money you want to donate" value={moneyRequire} onChange={moneyMessageChange}/>
                </Form.Input>
                <Form.Input value={email} onChange={emailMessageChange} label='Email' placeholder='joe@schmoe.com' />
                <Confirm
                    open={open}
                    header='Your request is finish!'
                    content="Thanks for using ours DApp!"
                    cancelButton='Got it!'
                    confirmButton="Thanks for blockchain!"
                    onCancel={changeClose}
                    onConfirm={changeClose}
                />
                <Button onClick={createDonate}>Submit donate</Button>
                <Progress percent={percent} autoSuccess />
            </Form>

        </div>

  );
}

export default App;

