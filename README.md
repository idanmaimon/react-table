# react-table

## React Table
==================
A Dynamic table for server side sorting, pagination and search
Each Column can be rendered as a type string,Date or Your Own React Component
If you decide to use your component for column display, the related item will be pass to your component 
via props as props.data

### Usage Example
====================
```
import React
import Table from 'react-table'

class MyContainer extends React.Component() {
  constructor(props) {
    this.state = {
        data: [], //your data
        count:0,
        PAGE_SIZE: 20,
    }
  }
  getColumns() {
    return [{
			name: 'photo',
			title: 'Profile Image',
			reactClass: <YOUR_REACT_COMPONENT />
		},{
			name: 'name',
			title:'Name',
			className:'sorting'
		},{
			name: 'age',
			title:'AGE',
			className:'sorting'
		},{
			name: 'created_at',
			title:'Created At',
			type: 'date',
			className:'sorting'
		}];
  }
  getData() {
    //bind with your store
    //setState({data,count})
  }
  onSortChange(column_name){}
  onSearchChange(search_phrase) {}
  onPageChange(pageNumber) {}
  render() {
    return (
    <Table
					items={this.state.data}
					loading={this.state.loading}
					count={this.state.count}
					pageSize={this.state.PAGE_SIZE}
					showPager={true} //optional
					onRefresh={this.getData.bind(this)}
					showSearch={true} //optional
					onSortChange={this.onSortChange.bind(this)}
					onSearchChange={this.onSearchChange.bind(this)}
					onPageChange={this.onPageChange.bind(this)}
					onPageSizeChange={this.onPageSizeChange.bind(this)}
					columns={this.getColumns} 
                />
    )
  }
}
```
