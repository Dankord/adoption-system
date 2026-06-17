# AGENTS.md

## Project Overview

This project is a full-stack pet adoption management system.

### Tech Stack

Frontend
- Next.js 15 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- Axios

Backend
- Laravel 12
- PHP 8.3+
- MySQL
- Laravel Sanctum
- Eloquent ORM
- Laravel API Resources

---

# General Rules

- Prefer readability over clever code.
- Keep functions small.
- Avoid duplicated logic.
- Use descriptive variable names.
- Do not introduce unnecessary dependencies.
- Follow existing project architecture.
- Keep code strongly typed.
- Never use `any` unless absolutely necessary.
- Explain complex logic with concise comments.

---

# Frontend Guidelines (Next.js)

## Components

- Prefer Server Components.
- Only use `"use client"` when necessary.
- Keep components under ~200 lines when possible.
- Extract reusable UI.

## Styling

- Tailwind only.
- Use shadcn/ui before creating custom components.
- Avoid inline styles.

## Forms

Always use

- React Hook Form
- Zod validation

Never manually validate form data.

## Data Fetching

Use

- TanStack Query

Avoid fetch logic inside UI components.

## API

Create API wrappers.

Example:

```ts
export const PetService = {
    getAll() {},
    create() {},
    update() {},
}
```

Avoid calling axios directly inside components.

---

# Laravel Guidelines

## Controllers

Controllers should stay thin.

Controller

- validate request
- authorize action
- call service
- return resource

Avoid business logic inside controllers.

Example

```php
public function store(StorePetRequest $request)
{
    $pet = $this->petService->create($request->validated());

    return new PetResource($pet);
}
```

---

## Validation

Always use Form Requests.

Example

```
php artisan make:request StorePetRequest
```

Never validate directly in controllers unless trivial.

---

## Models

Keep models focused.

Use

- relationships
- scopes
- casts
- accessors
- mutators

Avoid large business methods.

Example

```php
public function applications()
{
    return $this->hasMany(Application::class);
}
```

---

## Services

Business logic belongs inside Services.

Example

```
app/Services/PetService.php
```

```php
class PetService
{
    public function create(array $data): Pet
    {
        return Pet::create($data);
    }
}
```

Controllers should never contain complex logic.

---

## Resources

Always return API Resources.

Example

```php
return new PetResource($pet);
```

Collections

```php
return PetResource::collection($pets);
```

Never expose raw Eloquent models.

---

## Eloquent

Prefer Eloquent relationships.

Use eager loading.

Example

```php
Pet::with('applications')->get();
```

Avoid N+1 queries.

---

## Migrations

- One migration per table change.
- Use foreign keys.
- Add indexes where appropriate.
- Keep migrations reversible.

---

## Authentication

Use Laravel Sanctum.

Protect routes using middleware.

```php
Route::middleware('auth:sanctum')->group(function () {

});
```

---

## Authorization

Use Policies or Gates.

Avoid checking roles directly in controllers.

Prefer

```php
$this->authorize('update', $pet);
```

instead of

```php
if ($user->role === 'admin')
```

---

## File Uploads

Use Laravel Storage.

Never store uploaded files manually.

Example

```php
$path = $request->file('photo')->store('pets');
```

Use symbolic links for public files.

```
php artisan storage:link
```

---

## Database

Use transactions when multiple writes occur.

Example

```php
DB::transaction(function () {
    ...
});
```

---

## API Responses

Success

```json
{
    "data": {}
}
```

Errors

```json
{
    "message": "...",
    "errors": {}
}
```

Use consistent response structures.

---

# Naming

Classes

- PascalCase

Methods

- camelCase

Database

- snake_case

Routes

- kebab-case

---

# Folder Structure

Frontend

```
app/
components/
hooks/
services/
types/
lib/
```

Backend

```
app/
    Http/
    Models/
    Services/
    Policies/
    Actions/
    Resources/
routes/
database/
```

---

# Testing

Frontend

- Vitest
- React Testing Library

Backend

- Pest
- Feature tests
- Unit tests

Write tests for business logic.

---

# Performance

Frontend

- Lazy load heavy components.
- Optimize images.
- Cache queries when appropriate.

Backend

- Eager load relationships.
- Use pagination.
- Queue expensive jobs.
- Cache frequently accessed data.

---

# Code Style

Before creating new code

- Search for existing implementations.
- Reuse existing components.
- Reuse services.
- Reuse validation.

Do not duplicate logic.

Follow the existing project conventions.