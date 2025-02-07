from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID, uuid4
from pathlib import Path

from app.db.database import get_db
from app.db.models import LibraryRecord
from app.schemas import library_record_schemas as schema
from app.core.config import settings

UPLOAD_DIR = Path(settings.library_records_uploads)

router = APIRouter()

def get_library_record_by_id(db: Session, library_record_id: UUID):
    return db.query(LibraryRecord).filter(LibraryRecord.id == library_record_id).first()

def get_library_record_by_name(db: Session, library_record_name: str):
    return db.query(LibraryRecord).filter(LibraryRecord.name == library_record_name).first()

# CREATE

# No schema since the request is multipart/form-data
@router.post("/", status_code=201)
async def create_library_record(
    name: str = Form(...),
    description: str = Form(...),
    photo: UploadFile = File(None),  # photo is optional
    db: Session = Depends(get_db),
):
    if get_library_record_by_name(db, name):
        raise HTTPException(status_code=409, detail="Library record with this name already exists")

    photo_url = None
    if photo:
        file_name = f"{uuid4()}-{photo.filename}"
        photo_path = UPLOAD_DIR / file_name
        with open(photo_path, "wb") as f:
            f.write(await photo.read())
        photo_url = f"/{settings.library_records_uploads}/{file_name}"

    new_library_record = LibraryRecord(
        name=name,
        description=description,
        photo=photo_url,
    )

    db.add(new_library_record)
    db.commit()
    db.refresh(new_library_record)

    return {"status": "OK", "data": new_library_record}

# READ

@router.get("/", response_model=List[schema.ReadLibraryRecord])
def read_library_records(db: Session = Depends(get_db)):
    return db.query(LibraryRecord).all()

@router.get("/{library_record_id}", response_model=schema.ReadLibraryRecord)
def read_library_record(library_record_id: UUID, db: Session = Depends(get_db)):
    library_record = get_library_record_by_id(db, library_record_id)
    if not library_record:
        raise HTTPException(status_code=404, detail="Library record doesn't exist")
    
    return library_record

# UPDATE

@router.patch("/{library_record_id}", status_code=200)
async def update_library_record(
    library_record_id: UUID, 
    name: str = Form(None, max_length=50),
    description: str = Form(None),
    photo: UploadFile = File(None), 
    db: Session = Depends(get_db)
):
    library_record = get_library_record_by_id(db, library_record_id)
    if not library_record:
        raise HTTPException(status_code=404, detail="Library record doesn't exist")
    if db.query(LibraryRecord).filter(LibraryRecord.name == name, LibraryRecord.id != library_record_id).first():
        raise HTTPException(status_code=409, detail="Library Record with this name already exists")
    
    if photo is not None:
        if library_record.photo:
            old_file_path = UPLOAD_DIR / Path(library_record.photo).name
            if old_file_path.exists():
                old_file_path.unlink()
        file_name = f"{uuid4()}-{photo.filename}"
        photo_path = UPLOAD_DIR / file_name
        with open(photo_path, "wb") as f:
            f.write(await photo.read())
        library_record.photo = f"/{settings.library_records_uploads}/{file_name}"

    if name:
        library_record.name = name
    if description:
        library_record.description = description

    db.commit()
    db.refresh(library_record)

    return {"status": "OK", "data": library_record}

# DELETE

@router.delete("/{library_record_id}", status_code=200)
def delete_library_record(library_record_id: UUID, db: Session = Depends(get_db)):
    library_record = get_library_record_by_id(db, library_record_id)
    if not library_record:
        raise HTTPException(status_code=404, detail="Library record doesn't exist")
    
    if library_record.photo:
        file_path = UPLOAD_DIR / Path(library_record.photo).name
        if file_path.exists():
            file_path.unlink()

    db.query(LibraryRecord).filter(LibraryRecord.id == library_record_id).delete(synchronize_session=False)
    db.commit()

    return {"status": "OK"}

# Delete only photo
@router.delete("/{library_record_id}/photo", status_code=200)
async def delete_photo(library_record_id: UUID, db: Session = Depends(get_db)):
    library_record = get_library_record_by_id(db, library_record_id)
    if not library_record:
        raise HTTPException(status_code=404, detail="Library record doesn't exist")
    
    if library_record.photo:
        # Remove the photo file
        old_file_path = UPLOAD_DIR / Path(library_record.photo).name
        if old_file_path.exists():
            old_file_path.unlink()
        library_record.photo = None

    db.commit()
    db.refresh(library_record)
    return {"status": "OK", "message": "Photo deleted successfully"}
        