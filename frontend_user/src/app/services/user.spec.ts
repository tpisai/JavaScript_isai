import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user';
import { environment } from '../../environments/environment.development';

const URL = `${environment.apiUrl}/users`;

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll hace GET a /users', () => {
    service.getAll().subscribe((users) => expect(users.length).toBe(1));
    const req = http.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Ana', email: 'ana@mail.com' }]);
  });

  it('create hace POST con el cuerpo', () => {
    service.create({ name: 'Luis', email: 'luis@mail.com' }).subscribe();
    const req = http.expectOne(URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Luis', email: 'luis@mail.com' });
    req.flush({ id: 2, name: 'Luis', email: 'luis@mail.com' });
  });

  it('update hace PUT a /users/:id', () => {
    service.update(5, { name: 'Ana María' }).subscribe();
    const req = http.expectOne(`${URL}/5`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 5, name: 'Ana María', email: 'ana@mail.com' });
  });

  it('delete hace DELETE a /users/:id', () => {
    service.delete(5).subscribe();
    const req = http.expectOne(`${URL}/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
