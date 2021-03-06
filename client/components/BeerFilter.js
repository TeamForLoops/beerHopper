import React from 'react'
import {connect} from 'react-redux'
import {filterBeers, getBeers} from '../store/allBeers'

export class BeerFilter extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.value]: event.target.checked
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    let types = Object.keys(this.state)
    const typesObj = this.state
    types = types.filter(type => typesObj[type])
    if (!types.length) {
      this.props.fetchBeers()
    } else {
      this.props.getFilteredBeers(types)
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            {/* should map over types to make checkboxes */}

            {this.props.categories.map(category => (
              <div key={category.id}>
                <input
                  type="checkbox"
                  name="filter"
                  value={category.type}
                  onChange={this.handleChange}
                />
                <label htmlFor={category.type}>
                  {category.type[0].toUpperCase() + category.type.slice(1)}
                </label>
              </div>
            ))}

            <button type="submit">Submit</button>
          </fieldset>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getFilteredBeers: types => dispatch(filterBeers(types)),
    fetchBeers: () => dispatch(getBeers())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BeerFilter)
