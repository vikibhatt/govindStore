import { useEffect, useState,useRef } from "react";
import { Button, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { CartState } from "../context/Context";

const Cart = () => {
  const {
    state: { cart },
    dispatch,
  } = CartState();
  const [total, setTotal] = useState();
  const [actualPrice, setActualPrice] = useState();
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const flatDiscounts = {
    "newmember": 50,
  }
  const discounts = {
    "new40": 0.4,
    "new60": 0.6,
  }
  let discount;

  useEffect(() => {
    const calculateTotal = () => {
      const totalPrice = cart.reduce(
        (acc, curr) => acc + Number(curr.price) * curr.qty,0);
      if(totalPrice >= 499 && discounts.hasOwnProperty(appliedCoupon)) {
        if((Math.floor(totalPrice * discounts[appliedCoupon]) > 120)){
          discount = 120;
          setTotal(totalPrice - 120);
        }
        else
        discount = totalPrice * discounts[appliedCoupon];
        setTotal(Math.floor(totalPrice * (1-discounts[appliedCoupon])));
      } 
      else if(totalPrice >= 199 && flatDiscounts.hasOwnProperty(appliedCoupon)) {
        discount = flatDiscounts[appliedCoupon];
        setTotal(totalPrice - flatDiscounts[appliedCoupon]);
      } 
      else{
        setTotal(totalPrice);
        setActualPrice(totalPrice);
      }
    };
    calculateTotal();
  }, [cart, appliedCoupon, discounts]);

  const couponInputRef = useRef(null);
  const btnClick = () =>{
    const enteredCoupon = couponInputRef.current.value;
    setAppliedCoupon(enteredCoupon.toLowerCase());
  }

  return (
    <div className="cartHome">
      <div className="filters1 summary1">
      <div className="coupon">
      <span className = "space">
          <input type="text" placeholder="Apply coupon"  ref={couponInputRef}/>
          <Button type = "button" className="button"
            onClick={btnClick}>Apply</Button>
        </span>
      </div>
      </div>
      <div className="productContainer">
        <ListGroup>
          {cart.map((prod) => (
            <ListGroup.Item key={prod.id}>
              <Row>
                <Col md={2}>
                  <Image src={prod.image} alt={prod.name} fluid rounded />
                </Col>
                <Col md={2}>
                  <span>{prod.name}</span>
                </Col>
                <Col md={2}>₹ {prod.price}</Col>
                <Col md={2}>
                </Col>
                <Col md={2}>
                  <Form.Control
                    as="select"
                    value={prod.qty}
                    onChange={(e) =>
                      dispatch({
                        type: "CHANGE_CART_QTY",
                        payload: {
                          id: prod.id,
                          qty: e.target.value,
                        },
                      })
                    }
                  >
                    {[...Array(prod.inStock).keys()].map((x) => (
                      <option key={x + 1}>{x + 1}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: prod,
                      })
                    }
                  >
                    <AiFillDelete fontSize="20px" />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div className="filters summary" style={{ position: 'sticky', bottom: 0 }}>
        <span className="title">Subtotal ({cart.length}) items</span>
        <span className="total">
        <span>Total: ₹ {total}</span>
        <Button type="button" disabled={cart.length === 0}>
          Proceed to Checkout
        </Button>
        </span>
      </div>
    </div>
  );
};

export default Cart;
