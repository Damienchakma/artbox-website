'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle,
  Package,
  Download,
  ArrowLeft,
  MapPin,
  Lock,
  ChevronRight,
} from 'lucide-react';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder } = useApp();

  const hasPhysicalItems = cart.some((item) => item.editionType === 'physical');

  // Checkout Steps State: 1 = Address/Info, 2 = Payment, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Address Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Damien Chakma',
    email: 'damien@example.com',
    streetAddress: '742 Evergreen Terrace',
    apartment: 'Suite 4B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
    phone: '+1 (555) 234-5678',
  });

  // Shipping Method Choice State
  const [shippingMethod, setShippingMethod] = useState({
    id: 'standard',
    name: 'Standard Insured Crate Delivery',
    fee: 50,
    days: '3-5 Business Days',
  });

  // Payment Method Choice State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    name: 'Damien Chakma',
    expiry: '12/28',
    cvv: '888',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate final totals
  const shippingFee = hasPhysicalItems ? shippingMethod.fee : 0;
  const grandTotal = cartTotal + shippingFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const order = placeOrder({
      items: cart,
      shippingAddress: hasPhysicalItems ? shippingAddress : null,
      shippingMethod: hasPhysicalItems ? shippingMethod : null,
      paymentMethod: paymentMethod === 'card' ? 'Credit Card (Visa)' : paymentMethod === 'paypal' ? 'PayPal' : 'Crypto (ETH)',
      totalAmount: grandTotal,
    });
    setPlacedOrder(order);
    setStep(3);
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className={styles.emptyCheckoutPage}>
        <div className={styles.emptyBox}>
          <h2>No items to checkout</h2>
          <p>Your shopping cart is currently empty.</p>
          <Link href="/marketplace" className={styles.backBtn}>
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <title>Checkout — ArtBox Marketplace</title>
      <meta name="description" content="Complete your purchase for fine art physical originals and digital master licenses." />

      <div className={styles.container}>
        {/* Step Indicator */}
        <div className={styles.stepper}>
          <div className={`${styles.stepNode} ${step >= 1 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepLabel}>
              {hasPhysicalItems ? 'Delivery Address' : 'Customer Info'}
            </span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepNode} ${step >= 2 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepLabel}>Payment</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepNode} ${step >= 3 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>3</span>
            <span className={styles.stepLabel}>Confirmation</span>
          </div>
        </div>

        {/* STEP 3: ORDER CONFIRMATION VIEW */}
        {step === 3 && placedOrder && (
          <div className={styles.confirmationCard}>
            <div className={styles.successHeader}>
              <CheckCircle size={64} className={styles.successIcon} />
              <span className={styles.successTag}>Order Placed Successfully</span>
              <h1 className={styles.orderId}>Order #{placedOrder.orderId}</h1>
              <p className={styles.orderNotice}>
                A receipt and confirmation email have been sent to{' '}
                <strong>{placedOrder.shippingAddress?.email || 'your account'}</strong>.
              </p>
            </div>

            <div className={styles.confirmGrid}>
              {/* Left Details */}
              <div className={styles.confirmDetails}>
                <h3 className={styles.boxTitle}>Purchased Items</h3>
                <div className={styles.confirmItems}>
                  {placedOrder.items.map((item) => (
                    <div key={item.id} className={styles.confirmItemRow}>
                      <img src={item.image} alt={item.title} className={styles.confirmImg} />
                      <div className={styles.confirmMeta}>
                        <h4>{item.title}</h4>
                        <p>by {item.artist}</p>
                        <span className={item.editionType === 'physical' ? styles.physicalBadge : styles.digitalBadge}>
                          {item.editionType === 'physical' ? 'Physical Original' : '8K Digital Master'}
                        </span>
                      </div>
                      <div className={styles.confirmPriceGroup}>
                        <span className={styles.confirmQty}>Qty: {item.quantity}</span>
                        <span className={styles.confirmPrice}>
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.editionType === 'digital' && (
                          <button
                            onClick={() => alert(`Downloading high-resolution 8K Master File for ${item.title}...`)}
                            className={styles.downloadInstantBtn}
                          >
                            <Download size={13} /> Download 8K
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {placedOrder.shippingAddress && (
                  <div className={styles.addressBox}>
                    <h3 className={styles.boxTitle}>
                      <MapPin size={16} /> Delivery Destination
                    </h3>
                    <p><strong>{placedOrder.shippingAddress.fullName}</strong></p>
                    <p>{placedOrder.shippingAddress.streetAddress}, {placedOrder.shippingAddress.apartment}</p>
                    <p>{placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} {placedOrder.shippingAddress.postalCode}</p>
                    <p>{placedOrder.shippingAddress.country} • {placedOrder.shippingAddress.phone}</p>
                    <div className={styles.trackingNotice}>
                      <Truck size={15} /> Tracking Number: <strong>{placedOrder.trackingNumber}</strong> (Estimated delivery 3-5 days)
                    </div>
                  </div>
                )}
              </div>

              {/* Right Summary */}
              <div className={styles.confirmSummary}>
                <h3 className={styles.boxTitle}>Payment Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Payment Method</span>
                  <strong>{placedOrder.paymentMethod}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Date</span>
                  <span>{placedOrder.date}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping Fee</span>
                  <span>${placedOrder.shippingMethod?.fee || 0} USD</span>
                </div>
                <div className={styles.divider} />
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total Paid</span>
                  <span className={styles.goldTotal}>${placedOrder.totalAmount.toLocaleString()} USD</span>
                </div>

                <div className={styles.actionGroup}>
                  <Link href="/orders" className={styles.viewOrdersBtn}>
                    View Order Details
                  </Link>
                  <Link href="/marketplace" className={styles.continueShopBtn}>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 & 2 CHECKOUT FORM LAYOUT */}
        {step < 3 && (
          <div className={styles.layout}>
            {/* Left: Form Controls */}
            <div className={styles.formColumn}>
              {/* STEP 1: Delivery Address Form */}
              {step === 1 && (
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                      {hasPhysicalItems ? '1. Customer Delivery Address' : '1. Contact Details'}
                    </h2>
                    {hasPhysicalItems && (
                      <p className={styles.sectionDesc}>
                        Please provide your full shipping address for white-glove crate delivery of your physical artwork.
                      </p>
                    )}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep(2);
                    }}
                    className={styles.formGrid}
                  >
                    <div className={styles.inputGroupFull}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroupHalf}>
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroupHalf}>
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        required={hasPhysicalItems}
                        placeholder="+1 (555) 000-0000"
                        className={styles.input}
                      />
                    </div>

                    {hasPhysicalItems && (
                      <>
                        <div className={styles.inputGroupFull}>
                          <label>Street Address</label>
                          <input
                            type="text"
                            name="streetAddress"
                            value={shippingAddress.streetAddress}
                            onChange={handleInputChange}
                            required
                            placeholder="123 Gallery Lane"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.inputGroupHalf}>
                          <label>Apartment / Suite (Optional)</label>
                          <input
                            type="text"
                            name="apartment"
                            value={shippingAddress.apartment}
                            onChange={handleInputChange}
                            placeholder="Apt 4B"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.inputGroupHalf}>
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleInputChange}
                            required
                            placeholder="New York"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.inputGroupThird}>
                          <label>State / Province</label>
                          <input
                            type="text"
                            name="state"
                            value={shippingAddress.state}
                            onChange={handleInputChange}
                            required
                            placeholder="NY"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.inputGroupThird}>
                          <label>Postal / Zip Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={shippingAddress.postalCode}
                            onChange={handleInputChange}
                            required
                            placeholder="10001"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.inputGroupThird}>
                          <label>Country</label>
                          <input
                            type="text"
                            name="country"
                            value={shippingAddress.country}
                            onChange={handleInputChange}
                            required
                            placeholder="United States"
                            className={styles.input}
                          />
                        </div>

                        {/* Shipping Speed Option */}
                        <div className={styles.inputGroupFull}>
                          <label>Delivery Method</label>
                          <div className={styles.shippingMethods}>
                            <label
                              className={`${styles.shippingCard} ${
                                shippingMethod.id === 'standard' ? styles.shippingSelected : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name="shippingMethod"
                                checked={shippingMethod.id === 'standard'}
                                onChange={() =>
                                  setShippingMethod({
                                    id: 'standard',
                                    name: 'Standard Insured Crate Delivery',
                                    fee: 50,
                                    days: '3-5 Business Days',
                                  })
                                }
                              />
                              <div>
                                <strong>Standard Insured Crate ($50)</strong>
                                <p>Climate-controlled museum crate (3-5 business days)</p>
                              </div>
                            </label>

                            <label
                              className={`${styles.shippingCard} ${
                                shippingMethod.id === 'express' ? styles.shippingSelected : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name="shippingMethod"
                                checked={shippingMethod.id === 'express'}
                                onChange={() =>
                                  setShippingMethod({
                                    id: 'express',
                                    name: 'Express White-Glove Delivery',
                                    fee: 150,
                                    days: '1-2 Business Days',
                                  })
                                }
                              />
                              <div>
                                <strong>Express White-Glove Hand Delivery ($150)</strong>
                                <p>Courier delivery with professional installation (1-2 business days)</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    <div className={styles.inputGroupFull}>
                      <button type="submit" className={styles.nextStepBtn}>
                        Continue to Payment <ChevronRight size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: Payment Simulation Form */}
              {step === 2 && (
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <button onClick={() => setStep(1)} className={styles.backStepBtn}>
                      <ArrowLeft size={16} /> Back to Address
                    </button>
                    <h2 className={styles.sectionTitle}>2. Payment Options</h2>
                  </div>

                  <form onSubmit={handlePlaceOrder} className={styles.formGrid}>
                    <div className={styles.inputGroupFull}>
                      <div className={styles.paymentTabs}>
                        <button
                          type="button"
                          className={`${styles.paymentTab} ${paymentMethod === 'card' ? styles.paymentTabActive : ''}`}
                          onClick={() => setPaymentMethod('card')}
                        >
                          <CreditCard size={16} /> Credit / Debit Card
                        </button>
                        <button
                          type="button"
                          className={`${styles.paymentTab} ${paymentMethod === 'paypal' ? styles.paymentTabActive : ''}`}
                          onClick={() => setPaymentMethod('paypal')}
                        >
                          PayPal
                        </button>
                        <button
                          type="button"
                          className={`${styles.paymentTab} ${paymentMethod === 'crypto' ? styles.paymentTabActive : ''}`}
                          onClick={() => setPaymentMethod('crypto')}
                        >
                          Crypto (ETH)
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <>
                        <div className={styles.inputGroupFull}>
                          <label>Card Number</label>
                          <input
                            type="text"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            required
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.inputGroupFull}>
                          <label>Cardholder Name</label>
                          <input
                            type="text"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                            required
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.inputGroupHalf}>
                          <label>Expiration Date</label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            required
                            placeholder="MM/YY"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.inputGroupHalf}>
                          <label>CVV / CVC</label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            required
                            placeholder="123"
                            className={styles.input}
                          />
                        </div>
                      </>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className={styles.inputGroupFull}>
                        <div className={styles.simNotice}>
                          <p>You will be redirected to PayPal to complete your payment securely.</p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'crypto' && (
                      <div className={styles.inputGroupFull}>
                        <div className={styles.simNotice}>
                          <p>Pay with Ethereum (ETH) wallet via Web3 connector or QR invoice.</p>
                        </div>
                      </div>
                    )}

                    <div className={styles.inputGroupFull}>
                      <button type="submit" className={styles.placeOrderBtn}>
                        <Lock size={16} /> Pay ${grandTotal.toLocaleString()} & Place Order
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Cart Summary Sidebar */}
            <aside className={styles.sidebarColumn}>
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Order Summary ({cart.length})</h3>

                <div className={styles.sidebarItems}>
                  {cart.map((item) => (
                    <div key={item.id} className={styles.sidebarItem}>
                      <img src={item.image} alt={item.title} className={styles.sidebarImg} />
                      <div className={styles.sidebarMeta}>
                        <h4>{item.title}</h4>
                        <p>{item.artist}</p>
                        <span className={item.editionType === 'physical' ? styles.pBadge : styles.dBadge}>
                          {item.editionType === 'physical' ? 'Physical Original' : 'Digital 8K'}
                        </span>
                      </div>
                      <span className={styles.sidebarPrice}>
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.divider} />

                <div className={styles.sidebarRow}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()} USD</span>
                </div>

                {hasPhysicalItems && (
                  <div className={styles.sidebarRow}>
                    <span>Shipping ({shippingMethod.name})</span>
                    <span>${shippingMethod.fee} USD</span>
                  </div>
                )}

                <div className={`${styles.sidebarRow} ${styles.sidebarTotal}`}>
                  <span>Total Due</span>
                  <span className={styles.goldTotal}>${grandTotal.toLocaleString()} USD</span>
                </div>

                <div className={styles.securityBox}>
                  <ShieldCheck size={16} className={styles.securityIcon} />
                  <span>256-bit SSL Encrypted Transaction</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
