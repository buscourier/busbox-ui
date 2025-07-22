// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { environment } from '../../../environments/environment';
// import { Cargo } from '../types/Cargo';
// import { Service } from '../types/Service';
// import { DeliveryService } from './delivery.service';
//
// const dummyCargos: Cargo[] = [
//   {
//     id: '9',
//     name: 'Капот',
//     parent_id: '5',
//     use_dimensions: '0',
//   },
//   {
//     id: '25',
//     name: 'Балка',
//     parent_id: '5',
//     use_dimensions: '0',
//   },
// ];
//
// const dummyServices: Service[] = [
//   {
//     group_id: '1',
//     id: '18',
//     name: 'Пакет черный',
//     price: '10',
//     property: null,
//     site_name: null,
//     subgroup_id: '0',
//   },
//   {
//     group_id: '1',
//     id: '68',
//     name: 'Сейфпакет маленький (162х220х40)',
//     price: '15',
//     property: '16.2 х 22 см',
//     site_name: 'маленький',
//     subgroup_id: '2',
//   },
// ];
//
// const pickupCityId = '1';
// const deliveryCityId = '46';
//
// describe('DeliveryService', () => {
//   let service: DeliveryService;
//   let httpMock: HttpTestingController;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [DeliveryService],
//     });
//
//     service = TestBed.inject(DeliveryService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });
//
//   afterEach(() => {
//     httpMock.verify();
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
//
//   describe('loadCargos', () => {
//     it('should retry 3 times on error before failing', () => {
//       jasmine.clock().install();
//
//       const errorResponse = { status: 404, statusText: 'Not Found' };
//       let errorCaught = false;
//
//       service.loadCargos(pickupCityId, deliveryCityId).subscribe(
//         () => fail('should have failed with the 404 error'),
//         (error: Error) => {
//           expect(error.message).toContain('Ресурс не найден');
//           errorCaught = true;
//         },
//       );
//
//       // Симулируем 4 неудачные попытки (1 исходная + 3 повторения)
//       for (let i = 0; i < 4; i++) {
//         jasmine.clock().tick(1000); // Продвигаем время на 1 секунду
//         const req = httpMock.expectOne(
//           `${environment.apiBaseUrl}/calc/gettypes/${pickupCityId}/${deliveryCityId}`,
//         );
//         req.flush('Not Found', errorResponse);
//       }
//
//       jasmine.clock().tick(1000); // Даем время для обработки последней ошибки
//
//       expect(errorCaught).toBeTrue();
//
//       jasmine.clock().uninstall();
//     });
//   });
//
//   describe('loadServices', () => {
//     it('should return an Observable<Service[]>', () => {
//       service.loadServices(pickupCityId, deliveryCityId).subscribe(services => {
//         expect(services.length).toBe(2);
//         expect(services).toEqual(dummyServices);
//       });
//
//       const req = httpMock.expectOne(`${environment.apiBaseUrl}
//       /calc/getservices/${pickupCityId}`);
//       expect(req.request.method).toBe('GET');
//       req.flush(dummyServices);
//     });
//   });
//
//   describe('loadDeliverySettings', () => {
//     it('should return an Observable with both cargos and services', () => {
//       service.loadDeliverSettings(pickupCityId, deliveryCityId).subscribe(settings => {
//         expect(settings.cargos).toEqual(dummyCargos);
//         expect(settings.services).toEqual(dummyServices);
//       });
//
//       const cargoReq = httpMock.expectOne(
//         `${environment.apiBaseUrl}/calc/gettypes/${pickupCityId}/${deliveryCityId}`,
//       );
//       const serviceReq = httpMock.expectOne(
//         `${environment.apiBaseUrl}/calc/getservices/${pickupCityId}`,
//       );
//
//       cargoReq.flush(dummyCargos);
//       serviceReq.flush(dummyServices);
//     });
//   });
// });
