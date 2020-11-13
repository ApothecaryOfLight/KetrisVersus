'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = { liked: false };
	}

	render() {
		if( this.state.liked ) {
			return 'You liked this.';
		}
		return e(
			'button',
			{ onClick: () => this.setState({liked:true}) },
			'Like'
		);
	}
}

document.addEventListener( "DOMContentLoaded", function(event) {
	console.log( 'Initing...' );

	let div = document.createElement('div');
	div.className = 'blue';
	div.innerHTML = "<h2>Hello Javascript!!</h2>";
	document.body.append(div);

	console.log( 'Done!' );

	const domContainer = document.querySelector('#like_button_container');
	ReactDOM.render(e(LikeButton), domContainer);
});
