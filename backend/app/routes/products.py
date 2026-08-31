from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_products():
    """Get all products."""
    # TODO: Connect to database
    return {"message": "Products endpoint ready"}


@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a single product by ID."""
    # TODO: Fetch from database
    return {"message": f"Product {product_id} endpoint ready"}
