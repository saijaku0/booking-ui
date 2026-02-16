export interface CreateSpecialtyRequest {
  name: string;
}

export interface SpecialtyDto {
  id: string;
  name: string;
}

export interface UpdateSpecialtyRequest {
  id: string;
  name: string;
}
