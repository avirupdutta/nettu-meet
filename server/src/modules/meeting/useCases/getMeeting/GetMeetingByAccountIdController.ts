import { BaseController, NettuAppRequest, NettuAppResponse } from '../../../../shared/infra/http/models/BaseController';
import { GetMeetingByAccountIdUseCase } from './GetMeetingByAccountIdUseCase';
import { GetAccountDTO, getMeetingPathSchema } from './GetMeetingDTO';
import { GetMeetingUseCaseErrors } from './GetMeetingErrors';

export class GetMeetingByAccountIdController extends BaseController {
    private useCase: GetMeetingByAccountIdUseCase;

    constructor(useCase: GetMeetingByAccountIdUseCase) {
        super(null, getMeetingPathSchema);
        this.useCase = useCase;
    }

    async executeImpl(req: NettuAppRequest<{}, GetAccountDTO>, res: NettuAppResponse): Promise<void> {
        const dto: GetAccountDTO = {
            accountId: req.pathParams.accountId,
        };

        try {
            const result = await this.useCase.execute(dto);

            console.log(result);


            if (result.isLeft()) {
                const error = result.value;
                const e = error.errorValue();

                switch (error.constructor) {
                    case GetMeetingUseCaseErrors.MeetingNotFoundError:
                        return res.notFound(e.message);
                    default:
                        return res.fail();
                }
            } else {
                return res.ok(result.value);
            }
        } catch (err) {
            console.log(err);

            return res.fail();
        }
    }
}
