pragma solidity ^0.4.0;

contract zhongchou{

    struct funder{
        address funderaddress;
        uint Tomoney;
    }

    mapping(address => uint) public pendingReturns;
    uint public all;
    address admin=0x73962bC80E7AF9db30926e6144BEB0F5d8F0807b;
    uint256 shouxufei = 0.0000000000001 ether;

    struct needer{
        address Neederaddress;
        uint goal;
        string detial;
        string firstname;
        string lastname;
        string email;
        uint amount;
        uint funderAccount;
        mapping(uint => funder) map;
    }
    uint neederAmount;
    mapping(uint=>needer) needmap;



    function NewNeeder(address _Neederaddress, uint _goal, string detial,string firstname,string lastname,string email)public {
        neederAmount++;
        needmap[neederAmount] = needer (_Neederaddress, _goal,detial,lastname,firstname,email,0, 0);
    }




    function contribute(address _address, uint _neederAmount) public payable{
        needer storage _needer = needmap[_neederAmount];
        _needer.amount += msg.value-shouxufei;
        _needer.funderAccount++;
        _needer.map[_needer.funderAccount] = funder(_address, msg.value-shouxufei);
    }

    function IScompelete( uint _neederAmount)public payable{
        needer storage _needer = needmap[_neederAmount];
        if (_needer.amount >= _needer.goal ){
            _needer .Neederaddress.transfer(_needer.amount);
            admin.transfer(shouxufei);
        }
    }
    // function getNeed()public returns(string,string,string){

    // }
    function test(uint a)public view returns(string,string,string,string,uint,uint,uint){
        return(needmap[a].firstname,needmap[a].lastname,needmap[a].detial,needmap[a].email,needmap[a].goal,needmap[a].amount, needmap[a].funderAccount);
    }
}