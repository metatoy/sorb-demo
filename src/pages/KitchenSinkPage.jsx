import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  // Layout / grid
  Container,
  Row,
  Col,
  Stack,
  Vr,
  Ratio,
  Box,
  StickyTop,
  // Typography
  Display,
  Heading,
  Lead,
  Text,
  Small,
  Mark,
  Blockquote,
  BlockquoteFooter,
  List,
  ListInlineItem,
  // Buttons / badges
  Button,
  ButtonGroup,
  ButtonToolbar,
  Badge,
  CloseButton,
  // Feedback
  Alert,
  Spinner,
  Progress,
  ProgressBar,
  Placeholder,
  PlaceholderGlow,
  PlaceholderWave,
  // Cards
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  CardFooter,
  // List group
  ListGroup,
  ListGroupItem,
  // Forms
  FormControl,
  FormSelect,
  FormCheck,
  FormRange,
  FormLabel,
  FormText,
  FormGroup,
  FormRow,
  FormCol,
  ColFormLabel,
  InputGroup,
  InputGroupText,
  FloatingLabel,
  FormFeedback,
  // Navigation
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarText,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  PageItem,
  PageLink,
  Tabs,
  Tab,
  ScrollspyNav,
  // Table
  Table,
  // Overlays / interactive
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  OffcanvasBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  Tooltip,
  Popover,
  Toast,
  ToastHeader,
  ToastBody,
  ToastContainer,
  Accordion,
  AccordionItem,
  Collapse,
  useCollapse,
  // Media
  Image,
  Figure,
  FigureImage,
  FigureCaption,
  Carousel,
  CarouselItem,
  CarouselCaption,
  // Utilities / helpers
  TextBg,
  FocusRing,
  IconLink,
  StretchedLink,
  TextTruncate,
  VisuallyHidden,
  // Icons
  Icon,
  BsIconStar,
  BsIconCheck,
  BsIconHouse,
  BsIconSearch,
  BsIconGear,
  BsIconPlus,
  BsIconTrash,
  BsIconAlarm,
  BsIconChevronRight,
  BsIconChevronDown,
  BsIconGithub,
  BsIconTwitter,
  BsIconInstagram,
  BsIconFacebook,
  BsIconX,
} from '@metatoy/bootstrap-styled'
import { products, heroProduct } from '../data/catalog'
import { DISPLAY_STACK } from '../sorbBsTheme'

// ── Jane's Jeans · Kitchen Sink / Components index (GFP RC1 Part 3 · §F.4 / board 05)
//
// The proof of Bootstrap-5.3 parity: (nearly) every @metatoy/bootstrap-styled
// component the library ships, on ONE route, organised + labelled, with the
// Jane's Jeans denim voice in the copy. It's also the maximum re-skin surface —
// every colour reads var(--bs-*), never a raw hex, so a single bs-* preview push
// re-skins the whole page live with the rest of the site.
//
// Interactive components are wired with useState (Modal, Offcanvas, Toast,
// dismissible Alerts, Collapse) or are self-managing (Dropdown, Tooltip, Popover,
// Accordion, Tabs, Carousel, Pagination). A ScrollspyNav table-of-contents sits in
// a StickyTop sidebar on wide viewports.

const THEME_COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']

// ── shared style tokens (all var(--bs-*)) ────────────────────────────────────
const eyebrow = {
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--bs-primary)',
  marginBottom: '0.35rem',
}
const sectionStyle = {
  paddingTop: '2.75rem',
  marginTop: '1rem',
  borderTop: '1px solid var(--bs-border-color)',
  scrollMarginTop: '5rem',
}
const subheadStyle = {
  fontFamily: DISPLAY_STACK,
  color: 'var(--bs-body-color)',
  fontSize: '0.95rem',
  fontWeight: 700,
  margin: '1.5rem 0 0.75rem',
}
const codeStyle = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.875em',
  padding: '0.15em 0.4em',
  borderRadius: 'var(--bs-border-radius-sm, 0.375rem)',
  background: 'var(--bs-tertiary-bg)',
  color: 'var(--bs-primary)',
  border: '1px solid var(--bs-border-color)',
}
const wrap = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }
const swatchBox = {
  padding: '1rem',
  borderRadius: 'var(--bs-border-radius, 0.5rem)',
  border: '1px solid var(--bs-border-color)',
  background: 'var(--bs-tertiary-bg)',
}

const Section = ({ id, eyebrowText, title, children }) => (
  <section id={id} style={sectionStyle} data-testid={`ks-${id}`}>
    <span style={eyebrow}>{eyebrowText}</span>
    <Heading as="h2" size={3} style={{ fontFamily: DISPLAY_STACK, marginBottom: '1rem' }}>
      {title}
    </Heading>
    {children}
  </section>
)

// The table-of-contents targets (also the Scrollspy section ids).
const TOC = [
  { id: 'typography', label: 'Typography' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges-alerts', label: 'Badges & Alerts' },
  { id: 'feedback', label: 'Spinners & Progress' },
  { id: 'cards', label: 'Cards' },
  { id: 'listgroup', label: 'List Group' },
  { id: 'forms', label: 'Forms' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'tables', label: 'Tables' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'media', label: 'Media & Carousel' },
  { id: 'layout', label: 'Layout' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'icons', label: 'Icons' },
]

export const KitchenSinkPage = () => {
  // ── interactive state ───────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false)
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [dismissed, setDismissed] = useState({}) // alert variant → hidden
  const [page, setPage] = useState(2)
  const [range, setRange] = useState(60)
  const [navKey, setNavKey] = useState('all')
  const collapse = useCollapse({ defaultOpen: false })

  const dismiss = (v) => setDismissed((d) => ({ ...d, [v]: true }))

  return (
    <Container data-testid="page-components" style={{ padding: '2.5rem 0 4rem' }}>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={eyebrow}>Jane&apos;s Jeans · design system</span>
        <Display size={4} style={{ fontFamily: DISPLAY_STACK, letterSpacing: '-0.01em' }}>
          The whole rack
        </Display>
        <Lead style={{ color: 'var(--bs-secondary-color)', maxWidth: 640, marginTop: '0.5rem' }}>
          Every component we build the store from, on one page — the proof of full Bootstrap 5.3
          parity. Each surface reads <code style={codeStyle}>var(--bs-*)</code>, so a single token
          push re-skins the entire rack at once.
        </Lead>
      </div>

      <Row g={4} style={{ alignItems: 'flex-start', marginLeft: 0, marginRight: 0 }}>
        {/* ── Table of contents (Scrollspy) — sticky on lg+ ───────────────── */}
        <Col lg={3}>
          <StickyTop as="div" style={{ top: '1.5rem' }} data-testid="ks-toc">
            <span style={eyebrow}>On this page</span>
            <ScrollspyNav items={TOC} variant="nav" />
          </StickyTop>
        </Col>

        {/* ── Component gallery ───────────────────────────────────────────── */}
        <Col lg={9} style={{ minWidth: 0 }}>
          {/* ========================= TYPOGRAPHY ========================= */}
          <Section id="typography" eyebrowText="Foundations" title="Typography">
            <Display size={2} style={{ fontFamily: DISPLAY_STACK }}>Display heading</Display>
            <Heading as="h1" size={1}>h1. Denim, done right.</Heading>
            <Heading as="h2" size={2}>h2. Built to be worn hard</Heading>
            <Heading as="h3" size={3}>h3. Honest mid-blue wash</Heading>
            <Heading as="h4" size={4}>h4. 12.5 oz cotton denim</Heading>
            <Heading as="h5" size={5}>h5. Ethically made in Portugal</Heading>
            <Heading as="h6" size={6}>h6. Free 30-day returns</Heading>

            <Lead style={{ marginTop: '1rem', color: 'var(--bs-secondary-color)' }}>
              A lead paragraph — the one we build everything around, in a true straight leg.
            </Lead>
            <Text as="p" style={{ display: 'block', marginTop: '0.5rem' }}>
              Body text with a <Text as="span" weight="bold">bold run</Text>, an{' '}
              <Text as="span" italic>italic run</Text>, some <Mark>highlighted denim</Mark>, inline{' '}
              <code style={codeStyle}>--bs-primary</code> code, and a bit of{' '}
              <Small>small print about care.</Small>
            </Text>

            <Blockquote style={{ marginTop: '1rem' }}>
              <p>Best-fitting jeans I own — the denim broke in within a week.</p>
              <BlockquoteFooter>A verified buyer in <cite title="Source">Portland</cite></BlockquoteFooter>
            </Blockquote>

            <div style={wrap}>
              <List style={{ marginBottom: 0 }}>
                <li>Machine wash cold, inside out</li>
                <li>Line dry to hold the indigo</li>
                <li>Warm iron if needed</li>
              </List>
              <List inline style={{ marginBottom: 0 }}>
                <ListInlineItem>Straight</ListInlineItem>
                <ListInlineItem>Slim</ListInlineItem>
                <ListInlineItem>Relaxed</ListInlineItem>
              </List>
            </div>
          </Section>

          {/* ========================= BUTTONS ========================= */}
          <Section id="buttons" eyebrowText="Actions" title="Buttons">
            <div style={subheadStyle}>Solid variants</div>
            <div style={wrap}>
              {THEME_COLORS.map((v) => (
                <Button key={v} variant={v}>{v}</Button>
              ))}
            </div>

            <div style={subheadStyle}>Outline variants</div>
            <div style={wrap}>
              {THEME_COLORS.map((v) => (
                <Button key={v} variant={`outline-${v}`}>{v}</Button>
              ))}
            </div>

            <div style={subheadStyle}>Sizes &amp; states</div>
            <div style={wrap}>
              <Button variant="primary" size="lg">Large add to cart</Button>
              <Button variant="primary">Default</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button as={Link} to="/checkout" variant="outline-primary">As a router Link</Button>
            </div>

            <div style={subheadStyle}>ButtonGroup &amp; ButtonToolbar</div>
            <ButtonToolbar style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <ButtonGroup aria-label="Sort">
                <Button variant="outline-primary">Newest</Button>
                <Button variant="primary">Popular</Button>
                <Button variant="outline-primary">Price</Button>
              </ButtonGroup>
              <ButtonGroup size="sm" aria-label="Sizes">
                {['30', '32', '34'].map((s) => (
                  <Button key={s} variant="outline-secondary">{s}</Button>
                ))}
              </ButtonGroup>
              <ButtonGroup vertical aria-label="Vertical">
                <Button variant="outline-primary">Wishlist</Button>
                <Button variant="outline-primary">Compare</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Section>

          {/* ========================= BADGES & ALERTS ========================= */}
          <Section id="badges-alerts" eyebrowText="Signals" title="Badges & Alerts">
            <div style={subheadStyle}>Badges</div>
            <div style={wrap}>
              {THEME_COLORS.map((v) => (
                <Badge key={v} variant={v}>{v}</Badge>
              ))}
              <Badge variant="primary" pill>New</Badge>
              <Badge variant="danger" pill>Sale</Badge>
              <Button variant="primary">
                Cart <Badge variant="light" pill>3</Badge>
              </Button>
            </div>

            <div style={subheadStyle}>Alerts (dismissible)</div>
            {['primary', 'success', 'warning', 'danger', 'info'].map((v) =>
              dismissed[v] ? null : (
                <Alert
                  key={v}
                  variant={v}
                  data-testid={`ks-alert-${v}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
                >
                  <span>
                    <strong style={{ textTransform: 'capitalize' }}>{v}.</strong>{' '}
                    {v === 'success'
                      ? 'Your order shipped — track it in your account.'
                      : v === 'danger'
                        ? 'That size just sold out. Try the next size up.'
                        : v === 'warning'
                          ? 'Only 2 pairs left in Mid Blue, size 32.'
                          : 'Restock alerts are on for the Classic Straight.'}
                  </span>
                  <CloseButton
                    aria-label={`Dismiss ${v} alert`}
                    onClick={() => dismiss(v)}
                    data-testid={`ks-alert-close-${v}`}
                  />
                </Alert>
              ),
            )}
            {Object.keys(dismissed).length > 0 && (
              <Button variant="outline-secondary" size="sm" onClick={() => setDismissed({})}>
                Restore alerts
              </Button>
            )}
          </Section>

          {/* ========================= SPINNERS & PROGRESS ========================= */}
          <Section id="feedback" eyebrowText="State" title="Spinners, Progress & Placeholders">
            <div style={subheadStyle}>Spinners</div>
            <div style={wrap}>
              {['primary', 'secondary', 'success', 'danger'].map((v) => (
                <Spinner key={v} variant={v} aria-label={`${v} loading`} />
              ))}
              <Spinner variant="primary" size="sm" aria-label="small loading" />
              <Button variant="primary" disabled>
                <Spinner size="sm" aria-hidden="true" style={{ marginRight: '0.5rem' }} />
                Checking stock…
              </Button>
            </div>

            <div style={subheadStyle}>Progress</div>
            <div style={{ display: 'grid', gap: '0.6rem', maxWidth: 480 }}>
              <Progress><ProgressBar now={25} variant="primary" /></Progress>
              <Progress><ProgressBar now={50} variant="success" /></Progress>
              <Progress><ProgressBar now={75} variant="warning" /></Progress>
              <Progress data-testid="ks-progress-stacked">
                <ProgressBar now={35} variant="primary" />
                <ProgressBar now={20} variant="info" />
              </Progress>
            </div>

            <div style={subheadStyle}>Placeholders (loading skeleton)</div>
            <Card style={{ maxWidth: 320, borderColor: 'var(--bs-border-color)' }}>
              <CardBody>
                <PlaceholderGlow>
                  <Placeholder col={7} style={{ marginBottom: '0.5rem' }} />
                  <Placeholder col={12} size="sm" />
                  <Placeholder col={9} size="sm" />
                </PlaceholderGlow>
                <PlaceholderWave style={{ marginTop: '0.75rem' }}>
                  <Placeholder col={4} />
                </PlaceholderWave>
              </CardBody>
            </Card>
          </Section>

          {/* ========================= CARDS ========================= */}
          <Section id="cards" eyebrowText="Containers" title="Cards">
            <Row g={4}>
              {products.slice(0, 3).map((p) => (
                <Col key={p.slug} md={4} sm={6}>
                  <Card style={{ height: '100%', overflow: 'hidden', borderColor: 'var(--bs-border-color)', position: 'relative' }}>
                    <Ratio ratio="1x1">
                      <Image src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Ratio>
                    <CardBody>
                      <CardTitle style={{ fontFamily: DISPLAY_STACK, fontSize: '1.05rem' }}>{p.name}</CardTitle>
                      <CardSubtitle style={{ color: 'var(--bs-secondary-color)', marginBottom: '0.5rem' }}>
                        {p.wash} · {p.fit}
                      </CardSubtitle>
                      <CardText style={{ color: 'var(--bs-primary)', fontWeight: 700 }}>${p.price}</CardText>
                    </CardBody>
                    <CardFooter style={{ background: 'transparent', borderTop: '1px solid var(--bs-border-color)' }}>
                      <Button as={Link} to={`/product/${p.slug}`} variant="outline-primary" size="sm" style={{ width: '100%' }}>
                        View jeans
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={subheadStyle}>Card with header + StretchedLink</div>
            <Card style={{ maxWidth: 360, borderColor: 'var(--bs-border-color)', position: 'relative' }}>
              <CardHeader style={{ background: 'var(--bs-tertiary-bg)', fontWeight: 600 }}>Care guide</CardHeader>
              <CardBody>
                <CardTitle style={{ fontFamily: DISPLAY_STACK }}>Keep the indigo deep</CardTitle>
                <CardText style={{ color: 'var(--bs-secondary-color)' }}>
                  Wash cold, inside out, and line dry. The whole card is a{' '}
                  <StretchedLink as={Link} to="/components#overlays">link</StretchedLink>.
                </CardText>
              </CardBody>
            </Card>
          </Section>

          {/* ========================= LIST GROUP ========================= */}
          <Section id="listgroup" eyebrowText="Containers" title="List Group">
            <Row g={4}>
              <Col md={6}>
                <div style={subheadStyle}>Numbered + action items</div>
                <ListGroup numbered>
                  <ListGroupItem action>Pick your wash</ListGroupItem>
                  <ListGroupItem action>Choose a fit</ListGroupItem>
                  <ListGroupItem action active>Select your size</ListGroupItem>
                  <ListGroupItem action disabled>Checkout (choose a size first)</ListGroupItem>
                </ListGroup>
              </Col>
              <Col md={6}>
                <div style={subheadStyle}>Contextual variants</div>
                <ListGroup>
                  <ListGroupItem variant="primary">Bestseller · Classic Straight</ListGroupItem>
                  <ListGroupItem variant="success">In stock · ships today</ListGroupItem>
                  <ListGroupItem variant="warning">Low stock · size 32</ListGroupItem>
                  <ListGroupItem variant="danger">Sold out · Vintage Wash 26</ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
          </Section>

          {/* ========================= FORMS ========================= */}
          <Section id="forms" eyebrowText="Inputs" title="Forms">
            <Row g={4}>
              <Col md={6}>
                <FormGroup>
                  <FormLabel htmlFor="ks-email">Email for restock alerts</FormLabel>
                  <FormControl id="ks-email" type="email" placeholder="you@example.com" />
                  <FormText style={{ color: 'var(--bs-secondary-color)' }}>We only email on restocks.</FormText>
                </FormGroup>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <FormLabel htmlFor="ks-valid">Validation states</FormLabel>
                  <FormControl id="ks-valid" defaultValue="32" isValid />
                  <FormFeedback type="valid">Great — that size is in stock.</FormFeedback>
                </FormGroup>
                <FormGroup style={{ marginTop: '0.75rem' }}>
                  <FormControl aria-label="invalid sample" defaultValue="99" isInvalid />
                  <FormFeedback type="invalid">We don&apos;t carry that size.</FormFeedback>
                </FormGroup>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <FormLabel htmlFor="ks-fit">Preferred fit</FormLabel>
                  <FormSelect id="ks-fit" defaultValue="straight">
                    <option value="straight">Straight</option>
                    <option value="slim">Slim</option>
                    <option value="relaxed">Relaxed Tapered</option>
                  </FormSelect>
                </FormGroup>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <FormLabel htmlFor="ks-range">Waist ({range}&quot;)</FormLabel>
                  <FormRange id="ks-range" min={26} max={40} value={range} onChange={(e) => setRange(Number(e.target.value))} />
                </FormGroup>
              </Col>

              <Col md={6}>
                <div style={subheadStyle}>InputGroup</div>
                <InputGroup>
                  <InputGroupText>$</InputGroupText>
                  <FormControl aria-label="price" placeholder="98" />
                  <InputGroupText>.00</InputGroupText>
                </InputGroup>
                <InputGroup style={{ marginTop: '0.75rem' }}>
                  <FormControl placeholder="Search the rack" aria-label="search" />
                  <Button variant="primary"><BsIconSearch aria-hidden="true" /></Button>
                </InputGroup>

                <div style={subheadStyle}>FloatingLabel</div>
                <FloatingLabel label="Discount code" controlId="ks-float">
                  <FormControl placeholder="DENIM10" />
                </FloatingLabel>

                <div style={subheadStyle}>Checks, radios &amp; switch</div>
                <FormCheck type="checkbox" id="ks-chk" label="Add a matching denim jacket" defaultChecked />
                <FormCheck type="radio" name="ks-r" id="ks-r1" label="Standard shipping" defaultChecked />
                <FormCheck type="radio" name="ks-r" id="ks-r2" label="Express shipping" />
                <FormCheck type="switch" id="ks-sw" label="Gift wrap this order" />
                <FormCheck type="checkbox" inline id="ks-i1" label="Cuffed" />
                <FormCheck type="checkbox" inline id="ks-i2" label="Hemmed" />
              </Col>
            </Row>

            <div style={subheadStyle}>Horizontal form (FormRow / FormCol / ColFormLabel)</div>
            <FormRow align="center" style={{ maxWidth: 480 }}>
              <ColFormLabel sm={4} htmlFor="ks-h">Inseam</ColFormLabel>
              <FormCol sm={8}>
                <FormControl id="ks-h" placeholder="32 inches" />
              </FormCol>
            </FormRow>
          </Section>

          {/* ========================= NAVIGATION ========================= */}
          <Section id="navigation" eyebrowText="Wayfinding" title="Navigation">
            <div style={subheadStyle}>Nav (tabs) &amp; Nav (pills)</div>
            <Nav variant="tabs" style={{ marginBottom: '1rem' }}>
              {[['all', 'All'], ['straight', 'Straight'], ['slim', 'Slim'], ['relaxed', 'Relaxed']].map(([k, label]) => (
                <NavItem key={k}>
                  <NavLink as="button" active={navKey === k} onClick={() => setNavKey(k)}>{label}</NavLink>
                </NavItem>
              ))}
            </Nav>
            <Nav variant="pills">
              <NavItem><NavLink as="button" active>New in</NavLink></NavItem>
              <NavItem><NavLink as="button">Bestsellers</NavLink></NavItem>
              <NavItem><NavLink as="button" disabled>Archive</NavLink></NavItem>
            </Nav>

            <div style={subheadStyle}>Mini Navbar (NavbarBrand / NavbarText)</div>
            <Navbar variant="primary" expand="sm" style={{ borderRadius: 'var(--bs-border-radius, 0.5rem)', padding: '0.5rem 1rem' }}>
              <NavbarBrand as="span" style={{ fontFamily: DISPLAY_STACK, fontWeight: 700 }}>Jane&apos;s Jeans</NavbarBrand>
              <NavbarText style={{ marginLeft: 'auto' }}>Free returns for 30 days</NavbarText>
            </Navbar>

            <div style={subheadStyle}>Breadcrumb</div>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/" style={{ color: 'var(--bs-primary)', textDecoration: 'none' }}>Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/" style={{ color: 'var(--bs-primary)', textDecoration: 'none' }}>Jeans</Link></BreadcrumbItem>
              <BreadcrumbItem active aria-current="page">Classic Straight</BreadcrumbItem>
            </Breadcrumb>

            <div style={subheadStyle}>Pagination</div>
            <Pagination>
              <PageItem>
                <PageLink as="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</PageLink>
              </PageItem>
              {[1, 2, 3, 4].map((n) => (
                <PageItem key={n}>
                  <PageLink as="button" active={page === n} onClick={() => setPage(n)}>{n}</PageLink>
                </PageItem>
              ))}
              <PageItem>
                <PageLink as="button" disabled={page === 4} onClick={() => setPage((p) => Math.min(4, p + 1))}>Next</PageLink>
              </PageItem>
            </Pagination>

            <div style={subheadStyle}>Tabs</div>
            <Tabs defaultActiveKey="fit">
              <Tab eventKey="fit" title="Fit">
                <div style={{ padding: '1rem 0', color: 'var(--bs-secondary-color)' }}>
                  A true straight leg with a mid rise — room through the thigh, clean to the ankle.
                </div>
              </Tab>
              <Tab eventKey="fabric" title="Fabric">
                <div style={{ padding: '1rem 0', color: 'var(--bs-secondary-color)' }}>
                  98% cotton, 2% elastane · 12.5 oz denim woven in Portugal.
                </div>
              </Tab>
              <Tab eventKey="care" title="Care">
                <div style={{ padding: '1rem 0', color: 'var(--bs-secondary-color)' }}>
                  Machine wash cold, inside out. Line dry. Warm iron if needed.
                </div>
              </Tab>
            </Tabs>
          </Section>

          {/* ========================= TABLES ========================= */}
          <Section id="tables" eyebrowText="Data" title="Tables">
            <div style={subheadStyle}>Size chart — striped, bordered, hover</div>
            <Table striped bordered hover responsive data-testid="ks-size-chart">
              <thead>
                <tr>
                  <th>US size</th><th>Waist (in)</th><th>Hip (in)</th><th>Inseam (in)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['26', '26', '35', '30'],
                  ['28', '28', '37', '30'],
                  ['30', '30', '39', '32'],
                  ['32', '32', '41', '32'],
                  ['34', '34', '43', '34'],
                  ['36', '36', '45', '34'],
                ].map((r) => (
                  <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>
                ))}
              </tbody>
            </Table>
          </Section>

          {/* ========================= OVERLAYS / INTERACTIVE ========================= */}
          <Section id="overlays" eyebrowText="Interactive" title="Overlays & Disclosure">
            <div style={wrap}>
              <Button variant="primary" onClick={() => setShowModal(true)} data-testid="ks-open-modal">Open modal</Button>
              <Button variant="outline-primary" onClick={() => setShowOffcanvas(true)} data-testid="ks-open-offcanvas">Open cart drawer</Button>
              <Button variant="outline-primary" onClick={() => setShowToast(true)} data-testid="ks-show-toast">Notify me on restock</Button>
              <Button variant="outline-secondary" {...collapse.toggleProps} data-testid="ks-toggle-collapse">
                {collapse.open ? 'Hide' : 'Show'} care details
              </Button>
              <Tooltip content="Free 30-day returns">
                <Button variant="outline-secondary" data-testid="ks-tooltip-trigger">Hover me (tooltip)</Button>
              </Tooltip>
              <Popover title="Shipping" content="Ships in 1–2 business days from Portland.">
                <Button variant="outline-secondary" data-testid="ks-popover-trigger">Click me (popover)</Button>
              </Popover>
              <Dropdown>
                <DropdownToggle variant="primary" data-testid="ks-dropdown-toggle">Sort by</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Newest</DropdownItem>
                  <DropdownItem>Price: low to high</DropdownItem>
                  <DropdownItem>Price: high to low</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem disabled>Bundles (soon)</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <Collapse {...collapse.collapseProps} data-testid="ks-collapse">
              <Card style={{ marginTop: '1rem', maxWidth: 480, borderColor: 'var(--bs-border-color)' }}>
                <CardBody style={{ color: 'var(--bs-secondary-color)' }}>
                  Wash cold, inside out. Line dry to keep the indigo deep. Warm iron only if needed —
                  the denim gets better with every wear.
                </CardBody>
              </Card>
            </Collapse>

            <div style={subheadStyle}>Accordion (denim-care FAQ)</div>
            <Accordion defaultActiveKey="a1" data-testid="ks-accordion">
              <AccordionItem eventKey="a1" header="How do I keep the color from fading?">
                Wash as little as you can, always cold and inside out, and line dry. Denim is happiest worn, not washed.
              </AccordionItem>
              <AccordionItem eventKey="a2" header="Will these shrink?">
                Our stretch washes are pre-shrunk. The 100% cotton rigid denim will shrink slightly on the first wash, then settle.
              </AccordionItem>
              <AccordionItem eventKey="a3" header="What's your return policy?">
                Free 30-day returns on unworn pairs — no questions, no restocking fee.
              </AccordionItem>
            </Accordion>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered data-testid="ks-modal">
              <ModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <ModalTitle style={{ fontFamily: DISPLAY_STACK }}>Add to cart</ModalTitle>
                <CloseButton aria-label="Close" onClick={() => setShowModal(false)} />
              </ModalHeader>
              <ModalBody>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Image src={heroProduct.image} alt={heroProduct.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--bs-border-radius, 0.5rem)' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{heroProduct.name}</div>
                    <div style={{ color: 'var(--bs-secondary-color)' }}>Size 32 · ${heroProduct.price}</div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Keep shopping</Button>
                <Button as={Link} to="/checkout" variant="primary" onClick={() => setShowModal(false)}>Checkout</Button>
              </ModalFooter>
            </Modal>

            {/* Offcanvas cart drawer */}
            <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" data-testid="ks-offcanvas">
              <OffcanvasHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <OffcanvasTitle style={{ fontFamily: DISPLAY_STACK }}>Your cart</OffcanvasTitle>
                <CloseButton aria-label="Close" onClick={() => setShowOffcanvas(false)} />
              </OffcanvasHeader>
              <OffcanvasBody>
                <ListGroup flush>
                  <ListGroupItem style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Classic Straight · 32</span><strong>$98</strong>
                  </ListGroupItem>
                  <ListGroupItem style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Slim Indigo · 30</span><strong>$108</strong>
                  </ListGroupItem>
                </ListGroup>
                <Button as={Link} to="/checkout" variant="primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setShowOffcanvas(false)}>
                  Go to checkout
                </Button>
              </OffcanvasBody>
            </Offcanvas>

            {/* Toast */}
            <ToastContainer position="bottom-end" style={{ padding: '1rem' }}>
              <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={4000} data-testid="ks-toast">
                <ToastHeader>
                  <BsIconAlarm aria-hidden="true" style={{ color: 'var(--bs-primary)', marginRight: '0.5rem' }} />
                  <strong style={{ marginRight: 'auto' }}>Restock alert set</strong>
                  <Small style={{ color: 'var(--bs-secondary-color)' }}>just now</Small>
                </ToastHeader>
                <ToastBody>We&apos;ll email you the moment the Classic Straight is back in your size.</ToastBody>
              </Toast>
            </ToastContainer>
          </Section>

          {/* ========================= MEDIA & CAROUSEL ========================= */}
          <Section id="media" eyebrowText="Media" title="Media & Carousel">
            <div style={subheadStyle}>Carousel</div>
            <div style={{ maxWidth: 640, borderRadius: 'var(--bs-border-radius-lg, 0.75rem)', overflow: 'hidden' }}>
              <Carousel interval={null} data-testid="ks-carousel">
                {products.slice(0, 3).map((p) => (
                  <CarouselItem key={p.slug}>
                    <Ratio ratio="16x9">
                      <Image src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Ratio>
                    <CarouselCaption>
                      <h5 style={{ fontFamily: DISPLAY_STACK }}>{p.name}</h5>
                      <p>{p.wash} · ${p.price}</p>
                    </CarouselCaption>
                  </CarouselItem>
                ))}
              </Carousel>
            </div>

            <div style={subheadStyle}>Figure &amp; Image (thumbnail / rounded)</div>
            <div style={wrap}>
              <Figure style={{ margin: 0 }}>
                <FigureImage src={heroProduct.image} alt={heroProduct.name} style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 'var(--bs-border-radius, 0.5rem)' }} />
                <FigureCaption>The Classic Straight, mid-blue wash.</FigureCaption>
              </Figure>
              <Image thumbnail src={products[1].image} alt={products[1].name} style={{ width: 140, height: 140, objectFit: 'cover' }} />
              <Image rounded src={products[2].image} alt={products[2].name} style={{ width: 140, height: 140, objectFit: 'cover' }} />
            </div>
          </Section>

          {/* ========================= LAYOUT ========================= */}
          <Section id="layout" eyebrowText="Structure" title="Layout">
            <div style={subheadStyle}>Grid (Container / Row / Col)</div>
            <Row g={2}>
              {[6, 3, 3, 4, 4, 4].map((span, i) => (
                <Col key={i} md={span}>
                  <div style={{ ...swatchBox, textAlign: 'center', color: 'var(--bs-secondary-color)' }}>col-md-{span}</div>
                </Col>
              ))}
            </Row>

            <div style={subheadStyle}>Ratio</div>
            <Row g={3}>
              {['1x1', '4x3', '16x9'].map((r) => (
                <Col key={r} sm={4}>
                  <Ratio ratio={r} style={{ ...swatchBox, display: 'grid', placeItems: 'center' }}>
                    <span style={{ color: 'var(--bs-secondary-color)' }}>{r}</span>
                  </Ratio>
                </Col>
              ))}
            </Row>

            <div style={subheadStyle}>Stack &amp; Vr</div>
            <Stack direction="horizontal" gap={3} style={{ alignItems: 'center' }}>
              <Badge variant="primary">Straight</Badge>
              <Badge variant="primary">Slim</Badge>
              <Vr />
              <span style={{ color: 'var(--bs-secondary-color)' }}>2 fits selected</span>
            </Stack>
          </Section>

          {/* ========================= UTILITIES ========================= */}
          <Section id="utilities" eyebrowText="Helpers" title="Utilities">
            <div style={wrap}>
              {THEME_COLORS.slice(0, 6).map((c) => (
                <TextBg key={c} color={c} style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--bs-border-radius, 0.5rem)' }}>
                  text-bg-{c}
                </TextBg>
              ))}
            </div>

            <div style={subheadStyle}>FocusRing · IconLink · TextTruncate · Box</div>
            <div style={wrap}>
              <FocusRing as="button" style={{ padding: '0.4rem 0.8rem', border: '1px solid var(--bs-border-color)', borderRadius: 'var(--bs-border-radius, 0.5rem)', background: 'var(--bs-body-bg)' }}>
                Focus me
              </FocusRing>
              <IconLink as={Link} to="/" hover style={{ color: 'var(--bs-primary)' }}>
                <BsIconChevronRight aria-hidden="true" /> Back to shop
              </IconLink>
            </div>
            <TextTruncate style={{ maxWidth: 240, marginTop: '0.75rem', color: 'var(--bs-secondary-color)' }}>
              This description of our 12.5 oz Portuguese selvedge denim is far too long to fit on one line and will truncate.
            </TextTruncate>
            <Box as="div" p={3} mt={3} bg="body-tertiary" rounded border style={{ maxWidth: 320 }}>
              A <code style={codeStyle}>Box</code> with utility props (p·bg·rounded·border).
            </Box>

            <div style={subheadStyle}>VisuallyHidden</div>
            <Button variant="outline-primary">
              <BsIconTrash aria-hidden="true" /> <VisuallyHidden>Remove from cart</VisuallyHidden> Remove
            </Button>
          </Section>

          {/* ========================= ICONS ========================= */}
          <Section id="icons" eyebrowText="Iconography" title="Icons">
            <div style={subheadStyle}>Tree-shakeable BsIcon* exports</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '1.5rem', color: 'var(--bs-primary)' }}>
              {[
                ['star', BsIconStar], ['check', BsIconCheck], ['house', BsIconHouse],
                ['search', BsIconSearch], ['gear', BsIconGear], ['plus', BsIconPlus],
                ['trash', BsIconTrash], ['alarm', BsIconAlarm], ['chevron-down', BsIconChevronDown],
                ['github', BsIconGithub], ['twitter', BsIconTwitter], ['instagram', BsIconInstagram],
                ['facebook', BsIconFacebook], ['x', BsIconX],
              ].map(([name, IconCmp]) => (
                <span key={name} title={name} style={{ display: 'grid', placeItems: 'center', width: '2.5rem' }}>
                  <IconCmp label={name} />
                </span>
              ))}
            </div>
            <div style={subheadStyle}>Dynamic <code style={codeStyle}>&lt;Icon name=&quot;…&quot; /&gt;</code></div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '1.5rem', color: 'var(--bs-body-color)' }}>
              <Icon name="star" label="star" />
              <Icon name="house" label="house" />
              <Icon name="gear" label="gear" />
            </div>
          </Section>
        </Col>
      </Row>
    </Container>
  )
}
