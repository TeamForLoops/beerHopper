// Create Single View Here

import React from 'react'
import {fetchSingleBeer} from '../store/singleBeer' // unassignProjectThunk
import {connect} from 'react-redux'
import {toDollars} from '../store/allBeers'
import AddReviewForm from './addNewReview'
import {addItemThunk} from '../store/cart'
import {Link} from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

class SingleBeer extends React.Component {
  constructor() {
    super()

    this.state = {
      showForm: false,
      showCart: false
    }
  }

  componentDidMount() {
    try {
      this.props.loadSingleBeer(this.props.match.params.beerId)
    } catch (error) {
      console.error(error)
    }
  }

  clickHandler() {
    let hidden = this.state.showForm
    this.setState({
      showForm: !hidden
    })
  }
  addToCartHandler = () => {
    const beerId = this.props.beer.id
    this.props.addItem({id: beerId, quantity: 1})
    const message = this.state.showCart
    this.setState({showCart: true})
  }

  // eslint-disable-next-line complexity
  render() {
    // single beer prop
    // reviews are properties on beer

    const beer = this.props.beer || {}
    // reviews array inside beer prop

    const reviews = beer.reviews || []

    return (
      <Container className="mx-auto" id="single-beer">
        <img src={beer.imageUrl} className="mx-auto" />
        <Card.Body>
          <Card.Title>{beer.name}</Card.Title>
          <Card.Text>
            <div className="details">
              <ul>
                <li>
                  <p>IBU: {beer.ibu}</p>
                  <p>Color: {beer.color}</p>
                  <p>Description: {beer.description}</p>
                  <div>
                    {beer.quantityInv > 0 ? (
                      <span>IN STOCK </span>
                    ) : (
                      <span className="text-danger">OUT OF STOCK</span>
                    )}
                    {beer.quantityInv <= 10 && beer.quantityInv > 0 ? (
                      <span className="text-danger">
                        Only {beer.quantityInv} Left!
                      </span>
                    ) : (
                      ''
                    )}
                    <span>| Price: {toDollars(beer.price)}</span>
                  </div>
                </li>
              </ul>
            </div>
          </Card.Text>
          {/* setup conditional for if beer has no projects */}
          <div>
            {this.props.user.id ? (
              <Button
                onClick={() => {
                  this.clickHandler()
                }}
                type="button"
                variant="light"
              >
                Add Review
              </Button>
            ) : (
              <div className="">
                <Link to="/signup">Sign Up to Leave a Review!</Link>
              </div>
            )}
            {this.state.showForm && <AddReviewForm />}
          </div>
          <table id="single-beer-reviews" className="my-3">
            {reviews.length === 0
              ? `${beer.name} has no reviews!`
              : reviews.map(review => (
                  <tr
                    key={review.id}
                    className="border-top border-bottom border-dark"
                  >
                    <p> Rating: {review.rating} </p>
                    <p> {review.description} </p>
                    <p> Reviewer: {review.user.username} </p>
                    {/* pull name */}
                  </tr>
                ))}
          </table>

          {beer.quantityInv <= 0 ? (
            <h3 className="text-danger">OUT OF STOCK!</h3>
          ) : (
            <Button
              variant="warning"
              className="sm"
              onClick={() => this.addToCartHandler()}
            >
              Add To Cart
            </Button>
          )}
          {this.state.showCart && (
            <span className="mx-5">
              This item was added to your cart!
              <Link to="/cart">
                <Button variant="success" className="mx-3">
                  Go To Cart
                </Button>
              </Link>
            </span>
          )}
          <Link to="/beers">
            <Button variant="dark">Continue Shopping</Button>
          </Link>
        </Card.Body>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    beer: state.singleBeer,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadSingleBeer: id => dispatch(fetchSingleBeer(id)),
    addItem: itemDetail => dispatch(addItemThunk(itemDetail))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleBeer)
