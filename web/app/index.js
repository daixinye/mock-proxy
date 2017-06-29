'use strict'

class App {
    constructor(){
        ReactDOM.render(<Message name="React"/>, document.getElementById('app'))
    }
}
class Message extends React.Component {
    render(){
        return (
            <div> Hello {this.props.name} </div>
        )
    }
}
const app = new App()