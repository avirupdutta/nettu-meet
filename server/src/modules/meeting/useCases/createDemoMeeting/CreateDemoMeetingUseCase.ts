import { defaultAccountName } from '../../../../config';
import { AppError } from '../../../../shared/core/AppError';
import { Either, left } from '../../../../shared/core/Result';
import { UseCase } from '../../../../shared/core/UseCase';
import { IAccountRepo } from '../../../account/repos/accountRepo';
import { CreateMeetingResponseDTO } from '../createMeeting/CreateMeetingDTO';
import { CreateMeetingUseCase } from '../createMeeting/CreateMeetingUseCase';
import { CreateDemoMeetingDTO } from './CreateDemoMeetingDTO';

type Response = Either<AppError.UnexpectedError, CreateMeetingResponseDTO>;

export class CreateDemoMeetingUseCase implements UseCase<CreateDemoMeetingDTO, Promise<Response>> {
    private createMeetingUseCase: CreateMeetingUseCase;
    private accountRepo: IAccountRepo;

    constructor(createMeetingUseCase: CreateMeetingUseCase, accountRepo: IAccountRepo) {
        this.createMeetingUseCase = createMeetingUseCase;
        this.accountRepo = accountRepo;
    }

    public async execute(request: CreateDemoMeetingDTO): Promise<Response> {
        try {
            const account = await this.accountRepo.getAccountByAccountName(defaultAccountName);

            const res = await this.createMeetingUseCase.execute({
                account: account!,
                title: 'Demo meeting',
                openingTime: {
                    startTS: new Date().valueOf(),
                    endTS: new Date().valueOf() + 5 * 60 * 1000,
                },
                meetingHosts: [
                    "fe79df5ae57346d09044cbdff86fcbb2"
                ],
                presenters: [
                    "c3d18a0116214655964515d75c8aa4a5"
                ],
                attendees: [
                    "29219e23ee3e4ffca2ee3b8fa41932d7",
                    "00576f04c48f4230b05d6f7b39849940"
                ]
            });

            return res;
        } catch (err) {
            return left(new AppError.UnexpectedError(err.toString()));
        }
    }
}
