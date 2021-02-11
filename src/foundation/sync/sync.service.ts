import {InjectEntityManager} from '@nestjs/typeorm';
import {EntityManager} from 'typeorm';

export class SyncService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager
    ) {
    }

    save<T>(entity: T): void {
        void this.entityManager.save(Object.getPrototypeOf(entity), entity);
    }

    delete<T>(entity: T): void {
        void this.entityManager.remove(Object.getPrototypeOf(entity), entity);
    }
}