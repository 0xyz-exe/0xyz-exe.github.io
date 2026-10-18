---
title: CryptoMerchant
description: Payment workflow reference implementation
github: https://github.com/0xyz-exe/CryptoMerchant
tags: [NestJS, Next.js, Prisma, PostgreSQL, Socket.IO]
status: Reference Implementation
year: 2024
order: 2
---

# CryptoMerchant

A reference implementation exploring merchant authentication, invoice generation, and realtime event delivery for payment workflows.

## Overview

CryptoMerchant demonstrates core payment platform patterns:
- Role-based access control (RBAC)
- Invoice lifecycle management
- Realtime event delivery via WebSocket
- Transaction state tracking

## Tech Stack

**Frontend:** Next.js with TypeScript  
**Backend:** NestJS (Node.js framework)  
**Database:** PostgreSQL with Prisma ORM  
**Realtime:** Socket.IO for event streaming  

## What's Implemented

✅ **Authentication & Authorization**
- User registration and login
- JWT token generation and validation
- Role-based permissions (merchant, admin)
- Test coverage for auth flows

✅ **Invoice Management**
- Invoice creation with line items
- Status transitions (draft → pending → paid → expired)
- Invoice retrieval and listing
- Test coverage for invoice module

✅ **Realtime Events**
- WebSocket connection management
- Payment status broadcasts
- Invoice update notifications
- Room-based event scoping

## What's Not Implemented

The README clearly lists blockchain-provider integration as **planned future work**. This is not production payment infrastructure:

❌ Actual cryptocurrency wallet integration  
❌ Blockchain transaction verification  
❌ Settlement and reconciliation  
❌ PCI DSS compliance measures  
❌ Production-grade error handling  
❌ Rate limiting and abuse prevention  

## Architecture Decisions

### Why NestJS?
Structured module system and built-in dependency injection made it easier to separate concerns (auth, invoices, events) and write testable code.

### Why Prisma?
Type-safe database client with excellent TypeScript integration. Migrations and schema management felt cleaner than raw SQL or heavier ORMs.

### Why Socket.IO?
Reliable WebSocket abstraction with fallback transports and room-based broadcasting out of the box.

## Repository

[View source on GitHub →](https://github.com/0xyz-exe/CryptoMerchant)

## Related Projects

- [AI Workforce Platform](/projects/ai-workforce-platform/) — event-driven architecture patterns
- [Autonomous Business Builder](/projects/autonomous-business-builder/) — orchestration and state management
