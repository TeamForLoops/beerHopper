import React, {Component} from 'react'
import {connect} from 'react-redux'
import ItemView from './ItemView'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import {checkoutThunk, fetchCart} from '../store/cart'
import {setSubTotalThunk, clearSubTotal} from '../store/subTotal'
import {Link} from 'react-router-dom'
import StripeCheckout from 'react-stripe-checkout'
import Axios from 'axios'

class Cart extends Component {
  constructor() {
    super()
    this.handleToken = this.handleToken.bind(this)
  }
  componentDidMount() {
    this.props.setSubTotal()
    this.props.fetchCart()
  }
  checkoutHandler = () => {
    this.props.checkout(this.props.subTotal)
    this.props.clearSubTotal()
  }
  handleToken = async token => {
    const cart = this.props.cart
    const amount = this.props.subTotal
    const response = await Axios.post('/api/checkout', {token, amount})

    const {status} = response.data

    if (status === 'success') {
      this.checkoutHandler()
    }
  }
  render() {
    const cart = this.props.cart || []
    return (
      <React.Fragment>
        <Table className="mx-5 cart">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {cart.length > 0 ? (
              cart.map(item => <ItemView key={item.id} item={item} />)
            ) : (
              <tr>
                <td className="mx-5">
                  There are no items in your cart!
                  <Link to="/beers">
                    <Button variant="info">Go Back to Beers</Button>
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {cart.length > 0 && (
          <Container>
            <StripeCheckout
              stripeKey="pk_test_Op4RMowgyOZd3B6fDoKc1KSb00ij9iL8r5"
              token={this.handleToken}
              billingAddress
              shippingAddress
              amount={Number(this.props.subTotal.toFixed(2))}
              name="Beer Hopper"
            />
            <span className="mx-5">
              {' '}
              Subtotal: ${(this.props.subTotal / 100).toFixed(2)}
            </span>
          </Container>
        )}
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => {
  return {
    cart: state.cart,
    subTotal: state.subTotal,
    user: state.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    checkout: cartSubTotal => dispatch(checkoutThunk(cartSubTotal)),
    setSubTotal: () => dispatch(setSubTotalThunk()),
    clearSubTotal: () => dispatch(clearSubTotal()),
    fetchCart: () => dispatch(fetchCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
