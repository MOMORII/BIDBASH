(CMP-X301-0) Final Year Project
# FINAL YEAR PROJECT: BIDBASH
### Written by. Keisha Marie Geyrozaga (GEY23581805) [GitHub Profile](https://github.com/MOMORII)
---
### LIVE PROTOTYPE

**BIDBASH Prototype:**  https://bidbash-no8o.onrender.com/

> NOTE: The deployed system is an academic prototype intended for demonstration and evaluation purposes.

---
### REPOSITORY INFORMATION

This repository contains the source code, development artefacts, supporting documentation, and evaluation materials produced for **BIDBASH**, that is a Final Year Project (FYP) developed as part of an undergraduate (BEng) Software Engineering degree.

BIDBASH is a web-based prototype online auction system created to investigate whether a **hybrid functional-experiential design approach** can improve the usability and engagement of online auction platforms, particularly for novice or less-experienced users. The project combines conventional auction functionality with selected user-centred and experiential interface techniques, incl. clear system feedback, progression-oriented interaction, visual status communication, and simplified user workflows. As a result, the repository acts as both (i) a functional software artefact, and (ii) a research prototype used to support the accompanying dissertation and usability evaluation.

*Note: This project should not be considered as an equivalent to a production-ready commercial auction platform.*

---

## Project Overview

### PROJECT SUMMARY

BIDBASH is a user-facing online auction prototype designed around a **hybrid functional-experiential approach**.

The functional component of the system provides the essential behaviours expected of an online auction platform, including account creation, auction discovery, bidding, listing management, order progression, moderation, and user-specific activity dashboards.

Whereas, experiential component focuses on how these functions are communicated to the user. Instead of treating key bidder/seller workflows as purely-transactional processes, the BIDBASH system explores how clearer feedback, visual hierarchy, accessible interaction states, progression cues, and restrained gamified elements can make auction participation simpler, easier to understand, and more engaging.

The project's target scope is aimed towards users that are familiar with general online shopping, but possess limited experience with auction-based platforms. It seeks to make online auctions more accessible to a broader audience by challenging perceptions that auction participation is primarily suited to highly experienced bidders or individuals prepared to spend substantial amounts.

Similarly, the project does not assume that gamification inherently improves the user experience. It evaluates which experiential features participants perceive as useful, appropriate, and understandable within an online auction system.

---

### RESEARCH PURPOSE

The project investigates the extent to which user-centred design and selected gamification principles can improve the usability and perceived engagement of online auction systems.

The accompanying dissertation examines...

- usability challenges within existing online auction platforms
- barriers affecting novice auction users
- the role of clear visual and interaction feedback
- attitudes towards gamified and progression-based interface elements
- the importance of responsible gamification within financially sensitive interfaces
- the translation of user requirements into a working prototype
- the effectiveness of the resulting system through technical and usability evaluation

Consequently, the BIDBASH prototype is intended to function as a **proof-of-concept research artefact** through which the feasibility and practical application of the proposed design approach can be evaluated.

---

## Core Features

The final prototype includes the following principal functionality:

1. **Age Confirmation**
   - Users must confirm that they are aged 18 or over before accessing auction functionality, due to EU/UK legal restrictions

2. **User Registration and Authentication**
   - Account registration
   - Login, logout, and signup 
   - Session-based authentication
   - Password hashing using bcrypt
   - Password validation requirements
   - Access control for protected user and moderator routes

3. **Auction Discovery**
   - Homepage auction presentation
   - Featured and time-sensitive listings
   - Browse Auctions interface
   - Search bar functionality
   - Category filtering
   - Auction sorting

4. **Auction Detail Interface**
   - Product information
   - Listing images
   - Item condition and brand
   - Seller information
   - Current bid
   - Minimum valid next bid
   - Remaining auction time
   - Delivery and return information

5. **Bidding**
   - Bid-entry interface
   - Bid confirmation stage
   - Minimum-increment validation
   - Accepted, rejected, and outbid feedback states
   - User-specific bid activity
   - Auction status updates following valid bids

6. **My Bids Dashboard**
   - Active bids
   - Successful auctions
   - Bid history
   - Winning and losing status
   - Payment and fulfilment progress

7. **Seller Listing Management**
   - Create auction listings
   - Edit active listings
   - Upload listing images
   - Configure starting price and bid increment
   - Lock pricing fields once bidding has begun
   - View active listings
   - View successful sales
   - View listing history

8. **Order and Fulfilment Workflow**
   - Buyer payment state
   - Seller dispatch
   - Tracking reference entry
   - Buyer delivery confirmation
   - Completed order state

9. **Reporting and Moderation**
   - Report auction listings
   - Moderator access controls
   - Moderation case handling
   - Listing review and moderation outcomes

10. **Interface and Feedback Features**
    - Modal-based confirmations
    - Explicit success and error feedback
    - Dashboard status indicators
    - Sidebar navigation
    - Consistent colour scheme
    - Light and dark interface themes
    - Persistent theme preference
    - User-facing state changes following important actions

---

## Hybrid Functional-Experiential Approach

A central design principle of BIDBASH is the combination of **functional reliability** with **experiential interaction design**.

The project distinguishes between these two concerns:

#### FUNCTIONAL DESIGN

Functional design ensures that users can successfully complete the core tasks associated with an online auction system, including:

- registering and signing in
- locating auctions
- evaluating listings
- placing bids
- tracking auction outcomes
- publishing listings
- managing seller activity
- completing payment and fulfilment workflows
- reporting inappropriate listings

#### EXPERIENTIAL DEISGN

Experiential design considers how these interactions are perceived and understood by the user.

This includes:

- clear visual feedback after important actions
- visible winning, losing, accepted, rejected, and completion states
- simplified information hierarchy
- dashboard-based activity tracking
- optional theme customisation
- reduced reliance on colour alone for meaning
- progression-oriented feedback
- responsible use of gamification (without encouraging unnecessary financial participation)

The system intends to preserve the core functionality of traditional online auctions, whilst investigating whether experiential design can improve clarity, user confidence, and sustained engagement.

---

## Responsible Gamification

Since auction platforms involves financial decision-making, BIDBASH avoids treating increased spending or repeated bidding as desirable user behaviour. Instead, the project explores more restrained forms of gamification and experiential feedback, including:

- progress indicators
- visual confirmation of completed actions
- non-financial participation feedback
- optional celebratory interactions
- clear auction-state changes
- suggestions for continued browsing after auction completion
- user-controlled interface feedback

Resultantly, the system prioritises the clear communication of bid values, auction timing, and financial commitments over interaction designed solely to increase excitement, stimulation, or pressure.

---

## System Architecture

The implemented prototype follows a layered web-application structure with separation between interface rendering, request handling, business logic, and persistence.

The application is organised around...

- **Routes** – maps incoming requests to the required application behaviour
- **Controllers** – handles requests and prepares responses
- **Services** – contains auction, listing, user, order, notification, and moderation logic
- **Models / Data Structures** – represents application entities where appropriate
- **Views** – server-rendered Pug templates
- **Static Frontend Assets** – JavaScript (JS), CSS, images, and uploaded listing media
- **SQLite Database** – stores persistent application data

The implementation incorporates principles associated with MVC and layered architecture, while adopting a flexible hybrid structure suited to the scope & requirements of the prototype.

---

## Database and Persistence

BIDBASH uses SQLite through the better-sqlite3 package. The working database was populated using seeded JavaScript files and SQLite commands executed through the terminal, following the Entity Relationship Diagram (ERD) developed before formal implementation began. Minor adjustments were introduced during development to accommodate evolving system requirements and implementation constraints. Persistent data includes entities such as users, listings, listing images, auctions, bids, orders, payments, fulfilment states, reports, moderation cases, and notifications.

The implementation of data persistence was developed with reference to software-engineering practices observed during the researcher’s internship, particularly the separation of responsibilities across files and the encapsulation of database operations. Within this structure, prepared statements, input validation, foreign-key relationships, and transactional operations were implemented where appropriate to support data integrity and consistency.

---

## Technology Stack

The final prototype was implemented using the following technologies:

- Frontend: HTML, CSS, JavaScript (JS), PUG templating
- Backend: Node.js, Express.js
- Database (DB): SQLite, better-sqlite3

- Supporting Packages: bcrypt, express-session, multer

- IDE: Visual Studio Code (VSC), Node Package Manager (npm), SQLite command-line tools
- VSC: Git, GitHub

- Webhosting Service: Render

The application is deployed as a Node.js and Express web service through Render, with the deployment linked directly to the GitHub repository to support version-controlled updates.

---

## Security and Data Considerations

The project is a prototype intended for academic evaluation and does not process real financial transactions.

Implemented considerations include, but are not strictly limited to...

- bcrypt password hashing
- session-based authentication
- route-level access control
- server-side validation
- client-side validation (when required)
- parameterised database statements
- role-based moderator access
- account ownership checks
- controlled image-upload formats and file-size limits
- explicit confirmation prior to initial bid submission

*IMPORTANT: The prototype does not attempt to provide the full security infrastructure expected of a production financial or marketplace platform, but attempts to incorporate reasonable protective measures in consideration of the privacy and sanctity of user data.*

---

## Non-Functional Considerations

### USABILITY

The interface was designed to reduce unnecessary complexity and support users with limited experience of online auction platforms.

Usability decisions were informed by established interface design principles and common industry practices, with particular emphasis placed on consistency, predictability, visibility of system status, and clear user feedback.

This includes:

- familiar and consistent navigation patterns;
- a consistent visual hierarchy across major interfaces;
- predictable placement of primary actions and controls;
- visible system and auction status;
- explicit success, error, and confirmation feedback;
- clear presentation of current bid values and minimum valid bids;
- confirmation before bid submission;
- clear separation of bidder, seller, and account-management activities;
- and user-specific dashboards for reviewing auction and listing activity.

These design decisions were intended to reduce cognitive load and make auction-related tasks easier to understand for less-experienced users.

### ACCESSIBILITY

Accessibility considerations were informed by relevant **Web Content Accessibility Guidelines (WCAG)** principles and established web-design practices.

The prototype incorporates measures including:

- readable colour contrast
- consistent page structure and layout
- text-based status information
- avoidance of colour as the sole means of communicating meaning
- explicit labels for form controls
- clear headings and content grouping
- persistent and predictable navigation
- readable typography
- visual feedback that remains understandable across both light & dark interface themes

Accessibility was considered throughout the interface design and refinement process, although the prototype does not claim full WCAG conformance. The current implementation remains primarily desktop and laptop oriented, and whilst it is adjustable to tab size, it does not represent a fully responsive production implementation across all screen sizes and devices.

### PERFORMANCE

The prototype was developed for small-scale academic evaluation and demonstration.

Performance considerations focused on maintaining responsive interaction during typical prototype usage, incl. auction browsing, bidding, listing management, and dashboard navigation. The system has not been designed or evaluated for the transaction volumes, concurrency requirements, or infrastructure demands associated with a commercial-scale auction platform.

### MAINTAINABILITY

The application structure was developed to support maintainability and future extension through the separation of key responsibilities across routes, controllers, services, views, middleware, and database-related functionality.

This organisation was influenced by established software-engineering practices, including modularity, encapsulation, and separation of concerns. Consequently, individual areas of functionality can be modified or extended with reduced dependency on unrelated components of the system.

---

## Development Methodology

The project followed an iterative and user-centred development process in which research, design, implementation, and evaluation informed successive refinements of the prototype.

Development progressed through the following stages:

- background research and review of existing software
- requirements elicitation and analysis
- persona and user-journey development
- UML and system modelling
- high-fidelity interface design
- implementation of core auction functionality
- database integration
- frontend integration and refinement
- deployment via an external webhosting service
- functional system testing
- baseline questionnaire analysis
- think-aloud usability testing

An Agile-centred approach was adopted to support iterative development and accommodate changes identified throughout the project lifecycle. As a result, requirements, interface behaviour, and implementation decisions were refined as technical constraints, research findings, and user feedback emerged.

User-Centred Design (UCD) principles remained central to this process, particularly during the development of requirements, interface design, and usability evaluation. Feedback from the baseline survey and subsequent usability testing was used to assess whether the implemented system aligned with the needs of less-experienced auction users, as well as make improvements to the existing system, where feasibly possible.

Git and GitHub were used throughout development for version control, change tracking, and repository management, allowing modifications to the prototype to be recorded throughout the implementation process.

---

## User-Centred Evaluation

BIDBASH was evaluated using multiple forms of evidence.

### BASELINE SURVEY

A baseline questionnaire investigated:

- online marketplace familiarity
- previous auction experience
- barriers to auction participation
- functional priorities
- interface preferences
- attitudes towards gamification
- responsible gamification
- percieved clarity of proposed BIDBASH wireframes

The survey received **21 valid responses**.

### SYSTEM TESTING

Functional test cases were used to verify the behaviour of core prototype workflows. These included authentication, browsing, bidding, listing management, database persistence, moderation, order progression, and access control.

### USABILITY TESTING

A think-aloud usability testing method was deployed with a small sample of 3 representative users chosen from participants that volunteered to take part via a follow-up interest form attached to the end of the baseline survey presented to them.

Participants completed task-based interactions such as entering the system, registering & logging in, browsing live auctions, placing a bid, locating their user-specific bid activity, creating a listing, locating the created listing, and managing their listing on the seller dashboard. Observed usability issues were used to inform subsequent interface refinement, and contribute to suggestions in the future works section.

---

## Relationship to the Dissertation/Thesis

The repository supports the accompanying Final Year Project (FYP) dissertation, where the dissertation documents...

- the research problem
- literature review
- analysis of existing auction systems
- technical and research methodology
- requirements
- user experience and interface design
- UML and architectural modelling
- implementation
- technical testing
- baseline survey findings
- usability testing
- discussion
- final evaluation of the final prototype

*Note: Not every proposed design feature was implemented in the final system, as some supporting interfaces were introduced during implementation without having separate preliminary wireframes. These differences are documented as part of the project's iterative development process.*

---

## Scope & Limitations

BIDBASH is an academic prototype and has several deliberate limitations.

These include:

- no real payment processing
- no production-scale transaction infrastructure
- simplified authentication and account management compared with commercial platforms
- limited scalability testing
- desktop-first interface design
- local/static image-storage constraints
- limited real-time auction infrastructure
- a reduced implementation of some originally-proposed gamification features

Some interface concepts established during the design stage were not carried forward into the final prototype, while additional supporting screens and interactions were introduced during implementation. These changes reflected the evolving nature of the development process, as certain functional requirements, usability needs, and technical considerations only became apparent once the system was being implemented and tested in practice. 

In conclusion, the final prototype does not represent a direct 1:1 translation of the original design specification, but a refined outcome shaped by newly identified requirements and implementation-stage discoveries. This progression provides a more realistic representation of software development, in which requirements and design decisions revised as understanding of the system developed.

---

## Deployment

A hosted version of the prototype is available through Render on [BIDBASH](https://bidbash-no8o.onrender.com/) for academic evaluation and demonstration purposes. This is because the prototype uses SQLite & locally stored uploaded media, and thus, should not be interpreted as representative of a production-scale auction platform.

---

## Repository Structure

A simplified representation of the repository is shown below:

```text
BIDBASH/
│
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── app.js
│   └── routes.js
│
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   ├── images/
│   │   ├── js/
│   │   └── uploads/
│   │
│   └── views/
│
├── documentation/
│
├── package.json
└── README.md
