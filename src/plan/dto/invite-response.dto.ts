import { $Enums, Invite } from '@prisma/client';

export class InviteResponseDTO implements Invite {
    id: string;
    userId: string;
    planId: string;
    status: $Enums.InviteStatus;
}
