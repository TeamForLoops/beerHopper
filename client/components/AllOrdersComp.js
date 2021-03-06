import React from 'react'
import {connect} from 'react-redux'
import {toDollars, getOrders} from '../store/allOrders' // sortOrders
import {updateOrderThunk, fetchSingleOrder} from '../store/singleOrder'
// Status Filter import BeerFilter from './BeerFilter'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import {UncontrolledCollapse, CardBody} from 'reactstrap'
import {AvQueuePlayNext} from 'material-ui/svg-icons'

export class AllOrders extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      stat: ''
    }
    this.clickHandlerOne = this.clickHandlerOne.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.props.fetchInitialOrders()
  }

  clickHandlerOne() {
    let hidden = this.state.showForm
    this.setState({
      showForm: !hidden
    })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleSubmit(orderId) {
    event.preventDefault()
    try {
      const updatedOrder = {
        id: orderId,
        status: this.state.stat
      }

      await this.props.updateOrderThunk(updatedOrder)
      await this.props.loadSingleOrder(orderId)
      await this.props.fetchInitialOrders()
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const orders = this.props.orders || []
    return (
      <div>
        <div id="filter" />

        <div className="flex-cards">
          {orders.map(order => (
            <Card style={{width: '18rem'}} key={order.id}>
              <Card.Body>
                <Card.Title>Order Id: {order.id}</Card.Title>
                <Card.Text>
                  <div>
                    <ul>
                      <li>
                        <div className="highlight">
                          {order.user && <img src={order.user.imageUrl} />}
                        </div>
                        <div className="details">
                          <p>
                            {order.user
                              ? order.user.username
                              : 'Anonymous User'}
                          </p>
                          <p>Order Status: {order.status}</p>
                          <p>
                            Order Date:{' '}
                            {new Intl.DateTimeFormat('en-GB', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric'
                            }).format(new Date(order.createdAt))}
                          </p>
                          <div>
                            {' '}
                            Total Quantity:
                            {order.beers.reduce(function(totalQuantity, beer) {
                              return (
                                beer['beer-orders'].quantity + totalQuantity
                              )
                            }, 0)}
                          </div>
                          {/* */}
                          <div>
                            {' '}
                            Total Price:
                            {toDollars(
                              order.beers.reduce(function(totalPrice, beer) {
                                return (
                                  beer.price * beer['beer-orders'].quantity +
                                  totalPrice
                                )
                              }, 0)
                            )}
                          </div>
                          {/* */}

                          <br />

                          <Button
                            id={`status${order.id}`}
                            onClick={() => {
                              this.clickHandlerOne()
                            }}
                            variant="outline-primary"
                          >
                            Update Status Toggle
                          </Button>
                          <UncontrolledCollapse toggler={`#status${order.id}`}>
                            <form onSubmit={() => this.handleSubmit(order.id)}>
                              <div>
                                <span>
                                  <select
                                    name="stat"
                                    value={
                                      typeof order.status === 'string'
                                        ? this.state.stat
                                        : order.status
                                    }
                                    onChange={this.handleChange}
                                  >
                                    <option value="">
                                      select order status
                                    </option>
                                    <option value="open">open</option>
                                    <option value="processing">
                                      processing
                                    </option>
                                    <option value="cancelled">cancelled</option>
                                  </select>
                                </span>

                                <div>
                                  {/* */}
                                  <button type="submit">Edit</button>
                                </div>
                              </div>

                              {/* delete thunk
                                <span>
                                  <p>
                                    <button type="button">Delete</button>
                                  </p>
                                </span>
                                */}
                            </form>
                          </UncontrolledCollapse>
                          <div> -----------------------------------------</div>
                          <Button
                            variant="info"
                            id={`order${order.id}`}
                            style={{marginBottom: '1rem'}}
                          >
                            Order Details Toggle
                          </Button>
                          <UncontrolledCollapse toggler={`#order${order.id}`}>
                            <Card>
                              <CardBody>
                                <span>
                                  {order.user ? (
                                    <div>
                                      {order.beers.length === 0
                                        ? `${
                                            order.user.username
                                          } has no orders!`
                                        : order.beers.map(beer => (
                                            <div key={beer.id}>
                                              <p> Beer Name: {beer.name} </p>
                                              <img src={beer.imageUrl} />
                                              <p>
                                                {' '}
                                                Beer Description:{' '}
                                                {beer.description}{' '}
                                              </p>
                                              <p> Beer IBU: {beer.ibu} </p>
                                              <p>
                                                {' '}
                                                Beer Price:{' '}
                                                {toDollars(beer.price)}{' '}
                                              </p>

                                              <div>
                                                {' '}
                                                --------------------------------
                                              </div>
                                            </div>
                                          ))}
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </span>
                              </CardBody>
                            </Card>
                          </UncontrolledCollapse>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    orders: state.allOrders
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadSingleOrder: id => dispatch(fetchSingleOrder(id)),
    updateOrderThunk: updatedOrder => dispatch(updateOrderThunk(updatedOrder)),
    //getSortedBeers: (sortBy, beers) => dispatch(sortBeers(sortBy, beers)),
    fetchInitialOrders: () => dispatch(getOrders())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllOrders)
