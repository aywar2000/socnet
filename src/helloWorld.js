import React from "react"; //for every single component, import react
import axios from "axios";
import GreetYe from "./greetYe";
//CLASS SYNTAX - C in component must be capital C
export default class HelloWorld extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "bruce",
        };
    }
    componentDidMount() {
        console.log("bruce-lee");
        //axios.get("/some-url").then(resp=>{})
        //we can use this here; no need to declare it like var me = this, ...
        //update ->DO NOT DO THIS: this.state.first = "banana" <- NO NO NO!!!
        //this.setState({
        //    first: "banana-man",
        //})
        setTimeout(() => {
            this.setState({
                first: "BRUCE LEE",
            });
        }, 1000);
    }

    handleClick() {
        console.log("leave me alone!");
        //može i axios tu
        this.setState({
            first: "react",
        });
    }
    render() {
        return (
            <>
                <p onClick={() => this.handleClick()}>hellou</p>
                //<p>{this.state.first}</p>
                <GreetYe first={this.state.first} />
                <p>how</p>
                <p>you</p>
                <p>doin'?!</p>
            </>
        );
    }
}
//react also renders one element, but can have many kids
//            {" "}
// for styling, <>, </>

// return (
//     //js that looks like html
//     //jsx (od jutros)
//     <div>
//         <p>hellou</p>
//         <p>react</p>
//         <p>how</p>
//         <p>you</p>
//         <p>doin'?!</p>
//     </div>
// );
