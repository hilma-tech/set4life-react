import React,{Component} from 'react';


class ErrorBoundary extends Component{
    constructor(props) {
    super(props);
    this.state = {hasError: false };
}

componentDidCatch(error, info) {
    this.setState({hasError: true});
}

render() {
    console.log('haerror',this.state.hasError)
    if (this.state.hasError) {
        return <h1>Oops!!! Something went wrong</h1>;
    } else {
        return this.props.children;
        }
    }
}

export default ErrorBoundary;