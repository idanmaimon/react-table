'use strict';
import React from 'react';
import Pager from 'react-pager';
import cloneDeep from 'lodash.clonedeep';


function numberFormat(number,sep) {
	number = typeof number !== "undefined" && number > 0 ? number : "";
	number = number.replace(new RegExp("^(\\d{" + (number.length%3? number.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
	if(typeof sep !== "undefined" && sep !== " ") {
		number = number.replace(/\s/g, sep);
	}
	return number;
}

function sort() {

}

class Table extends React.Component {
	constructor(props) {
		super(props);

		this.handlePageChanged = this.handlePageChanged.bind(this);
		this.handlePageSizeChanged = this.handlePageSizeChanged.bind(this);
		this.onSelectionChange = this.onSelectionChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.onSortChange = this.onSortChange.bind(this);

		this.state = {
			search:"",
			asc:1,
			from:1,
			to:this.props.pageSize || 20,
			current:0,
			pageSize:this.props.pageSize || 20,
			count:0,
			total: 0
		};
	}
	componentWillReceiveProps(props) {
		if(JSON.stringify(props) !== JSON.stringify(this.props)) {
			this.setState({
				count:props.count,
				total:Math.floor(props.count / this.state.pageSize)+1
			});
		}
	}
	handlePageChanged(newPage) {
		var from=newPage*this.state.pageSize+1,
			to  =(newPage+1)*this.state.pageSize;
		if(newPage+1 === this.state.total) {
			from = (this.state.total-1)*this.state.pageSize+1;
			to = this.state.count;
		}
		this.setState({current : newPage,from : from,to: to});
		if(this.props.onPageChange){
			this.props.onPageChange(newPage*this.state.pageSize);
		}
	}
	handlePageSizeChanged(event) {
		var size = Number(event.target.value);
		this.setState({pageSize:size,to:this.state.from+size});
		if(this.props.onPageSizeChange){
			this.props.onPageSizeChange(size);
		}
	}
	onSelectionChange(e) {
		if(this.props.onSelectionChange) {
			this.props.onSelectionChange(e.target.parentElement.id);
		}
	}
	handleKeyPress(event) {
		let newState = {current:0,total:Math.floor(this.state.count / this.state.pageSize) + 1};
		if(this.props.onSearchChange) {
			if (event.key === 'Enter') {
				newState.search = "";
				this.setState(newState);
				this.props.onSearchChange(event.target.value);
			}
		}
		else {
			newState.search = event.key || event.target.value;
			newState.items = this.filter(newState.search);
			this.setState(newState);
		}
	}
	sort(details) {
		return this.props.items.sort((a,b)=>{
			if(details.asc === 1) {
				return (a[details.sort] > b[details.sort]) ? 1 : (a[details.sort] < b[details.sort]) ? -1 : 0;
			}
			return (a[details.sort] < b[details.sort]) ? 1 : (a[details.sort] > b[details.sort]) ? -1 : 0;
		});
	}
	filter(search) {
		if(!search) {
			return this.props.items;
		}
		let keys = Object.keys(this.props.items[0]);
		return this.props.items.filter((a)=>{
			let found = false;
			keys.forEach((key)=>{
				if(typeof a[key] === 'string' && a[key].indexOf(search) > -1) {
					found = true;
					return;
				}
			});
			return found;
		});
	}
	onSortChange(e) {
		let columnName = e.target.getAttribute("name"),
			asc = this.state.asc * -1,
			newState = {asc:asc};


		if(this.props.onSortChange) {
			asc = Number(asc);
			this.props.onSortChange({sort:columnName,asc:asc});
		}
		else {
			newState.items = this.sort({sort:columnName,asc:asc});
		}
		this.setState(newState);
	}
	onSearchChange(e) {
		e && e.preventDefault();
		if(this.props.onSearchChange) {
			this.props.onSearchChange(this.refs.searchInput.value);
		}
	}
	render() {
		var thead = this.props.columns.map(function(item,i) {
			return (<th key={i} name={item.name}
			            onClick={this.onSortChange}
			            className={item.className || ""}
			            tabIndex={i} aria-controls="datatable" rowSpan="1" colSpan="1">{item.title || item.name}</th>);
		}.bind(this));
		var tbody = (this.state.items || this.props.items).map(function(item,i) {
				var row = [];
				this.props.columns.forEach((col,index) => {
					if(col.reactClass) {
						row.push(<td key={index*2}><col.reactClass data={item} {...this.props} /></td>)
					}
					else if(col.type === 'date'){
						let date;
						if(typeof item.created_at !== "string") {
							date = new Date(item.created_at*1000).toDateString();
						}
						else {
							date = new Date(item.created_at.split("T")[0]).toDateString()
						}
						row.push(<td key={index*2}>{date}</td>)
					} else {
						var fieldData;
						if(item[col.name] && typeof item[col.name] === "object") {
							fieldData = item[col.name].givenName;
						}
						else if (item[col.name]) {
							fieldData = item[col.name]
						}
						else if (item[col.defaultName]) {
							fieldData = item[col.defaultName]
						}
						if(!fieldData && col.defaultValue) {
							fieldData = col.defaultValue;
						}
						row.push(<td key={index*2}>{(fieldData || '').toString()}</td>)
					}
				});
				return <tr id={item._id || item.id} onClick={this.onSelectionChange} key={i} role="row" className={i%2 === 0 ? "even" : "odd"}>{row}</tr>;
			}.bind(this)) || [];
		return <div className="react-table-container">
			<div className="row">
				<div className="col-sm-10" style={{display: this.props.showPager ? "block" : "none" }}>
					<div className="dataTables_length" id="datatable_length">
						<label>Show
							<select onChange={this.handlePageSizeChanged}  name="datatable_length" aria-controls="datatable" className="form-control input-sm">
								<option value="20">20</option>
								<option value="50">50</option>
								<option value="100">100</option>
								<option value="200">200</option>
							</select> results</label>
					</div>
				</div>

				<div className="col-sm-2" style={{display: this.props.showSearch ? "block" : "none" }}>
					<div className="main-search">
						<div className="input-wrap">
							<input className="form-control" ref="searchInput" type="text" placeholder={this.props.searchPlaceHolder || "Search by name..."} onKeyPress={this.handleKeyPress} defaultValue={this.state.search} onChange={this.handleKeyPress} />
							<a href="#" onClick={this.onSearchChange}>
								<i className="icon-search"></i>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-sm-12">
					<table className="table table-striped font-12">
						<thead>
						<tr role="row">
							{thead}
						</tr>
						</thead>
						<tbody>{tbody}</tbody>
					</table>
				</div>
			</div>
			<div style={{display: this.props.showPager ? "block" : "none" }}>
				<div className="row"><div className="col-sm-5">
					<div className="dataTables_info" id="datatable_info" role="status" aria-live="polite">Showing {this.state.from} to {this.state.to} of {numberFormat(this.state.count+"",",")} results</div>
				</div>
					<div className="col-sm-7">
						<Pager total={this.state.total}
						       current={this.state.current}
						       titles={{first:   'First',prev:    '\u00AB',
                                   prevSet: '...',nextSet: '...',next:    '\u00BB',
                                   last:    'Last'}}
						       visiblePages={3}
						       onPageChanged={this.handlePageChanged}/>
					</div>
				</div>
			</div>
		</div>


	}
}

module.exports = Table;