'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Table from './index';

console.log(Table);

class App extends React.Component {
	getCols() {
		return [{
				name: 'created_at',
				title:'Registered',
				type:'date',
				className:'sorting'
			},{
				name: 'name',
				title:'Name',
				className:'sorting'
			},
			{
				name: 'email',
				title:'Email'
			}];
	}
	getData() {
		return [{
			"created_at":new Date('1/1/1980'),
			name: "aaaa",
			email: "aaaa@aaaa.com"
		},{
			"created_at":new Date('1/1/1980'),
			name: "aababa",
			email: "aadc@acaa.com"
		},{
			"created_at":new Date('1/1/1970'),
			name: "bbbb",
			email: "bbbb@acbb.com"
		},{
			"created_at":new Date('1/1/1975'),
			name: "cccc",
			email: "cccbvc@cbccdc.com"
		},{
			"created_at":new Date('1/1/2000'),
			name: "dddd",
			email: "dddd@dddd.com"
		}];
	}
	render() {
		return (<div>
			<Table
				columns={this.getCols()}
				items={this.getData()}
			    showPager={false}
				showSearch={true}
			/>
		</div>)
	}
}


ReactDOM.render(<App />,document.getElementById('app'));
