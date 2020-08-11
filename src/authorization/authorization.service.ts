import { Injectable } from '@nestjs/common';
import { EnginesApi } from '@oryd/keto-client';
import { ListAllPoliciesDto_Request, ListAllPoliciesDto_Response } from './dto';

@Injectable()
export class AuthorizationService {
    private ketoAPI: EnginesApi;

    constructor() {
        this.ketoAPI = new EnginesApi();
    }


    isRequestAllowed() {

    }

    listAllPolicies(listAllPoliciesDto: ListAllPoliciesDto_Request): void {
        // return this.ketoAPI.listOryAccessControlPolicies()
    }

    createOrUpdateAccessPolicy() {

    }

    getPolicy(id: string) {

    }

    deletePolicy(id: string) {

    }

    listRoles() {

    }

    createOrUpdateRole() {

    }

    deleteRole() {

    }

    addAMemberToARole() {

    }

    removeAMemeberFromARole() {

    }

    subscribeToAliveStatus() {

    }

    subscribeToReadinessStatus() {

    }

    getServiceVersion() {

    }
}
