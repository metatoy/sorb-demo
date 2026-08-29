import React from 'react'
import {
  BootstrapStyledProvider,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardFooter,
  ListGroup,
  ListGroupItem,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  Alert,
} from '@metatoy/bootstrap-styled'
import { sorbBsTheme } from '../src/sorbBsTheme'

// Content + navigation + feedback captures for the Jane's Jeans golden file.
export default {
  title: 'JanesJeans/Content',
  decorators: [
    (Story) => (
      <BootstrapStyledProvider theme={sorbBsTheme}>
        <Story />
      </BootstrapStyledProvider>
    ),
  ],
}

export const BadgePill = { render: () => <Badge variant="primary" pill>New season denim</Badge> }
export const BadgeBestseller = { render: () => <Badge variant="primary" pill>Bestseller</Badge> }

export const ProductCard = {
  render: () => (
    <Card style={{ width: 300, overflow: 'hidden' }}>
      <div style={{ height: 220, background: 'var(--bs-tertiary-bg)' }} aria-hidden="true" />
      <CardBody>
        <CardTitle>Classic Straight Blue Jeans</CardTitle>
        <CardText style={{ color: 'var(--bs-primary)', fontWeight: 600 }}>$98</CardText>
        <CardText style={{ color: 'var(--bs-secondary-color)' }}>Mid Blue · Straight</CardText>
      </CardBody>
      <CardFooter>
        <Button variant="outline-primary" size="sm">View jeans</Button>
      </CardFooter>
    </Card>
  ),
}

export const OrderSummaryLine = {
  render: () => (
    <ListGroup flush style={{ width: 340 }}>
      <ListGroupItem style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
        <div style={{ width: 48, height: 48, background: 'var(--bs-tertiary-bg)', borderRadius: 8 }} aria-hidden="true" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>Classic Straight Blue Jeans</div>
          <div style={{ color: 'var(--bs-secondary-color)', fontSize: '0.85rem' }}>Size 32 · Qty 1</div>
        </div>
        <div style={{ fontWeight: 600 }}>$98.00</div>
      </ListGroupItem>
    </ListGroup>
  ),
}

export const SpecsList = {
  render: () => (
    <ListGroup style={{ width: 420 }}>
      <ListGroupItem style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Fabric</strong><span>98% cotton, 2% elastane denim</span></ListGroupItem>
      <ListGroupItem style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Rise</strong><span>Mid Rise</span></ListGroupItem>
      <ListGroupItem style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Fit</strong><span>Straight</span></ListGroupItem>
      <ListGroupItem style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Origin</strong><span>Ethically made in Portugal</span></ListGroupItem>
    </ListGroup>
  ),
}

export const Breadcrumbs = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Shop</BreadcrumbItem>
      <BreadcrumbItem active>Classic Straight Blue Jeans</BreadcrumbItem>
    </Breadcrumb>
  ),
}

export const ProductTabs = {
  render: () => (
    <Tabs defaultActiveKey="description" style={{ width: 520 }}>
      <Tab eventKey="description" title="Description"><div style={{ padding: '1rem 0' }}>The one we build everything around.</div></Tab>
      <Tab eventKey="details" title="Details & care"><div style={{ padding: '1rem 0' }}>Machine wash cold, inside out.</div></Tab>
      <Tab eventKey="reviews" title="Reviews (214)"><div style={{ padding: '1rem 0' }}>4.8 average across 214 reviews.</div></Tab>
    </Tabs>
  ),
}

export const AlertSuccess = {
  render: () => <Alert variant="success">Order placed — thank you!</Alert>,
}
