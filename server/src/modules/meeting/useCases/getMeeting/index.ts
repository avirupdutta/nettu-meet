import { accountRepo } from '../../../account/repos';
import { meetingRepo } from '../../repos';
import { GetMeetingByAccountIdController } from './GetMeetingByAccountIdController';
import { GetMeetingByAccountIdUseCase } from './GetMeetingByAccountIdUseCase';
import { GetMeetingController } from './GetMeetingController';
import { GetMeetingUseCase } from './GetMeetingUseCase';

const getMeetingUseCase = new GetMeetingUseCase(meetingRepo, accountRepo);
const getMeetingByAccountIdUseCase = new GetMeetingByAccountIdUseCase(meetingRepo, accountRepo);
const getMeetingController = new GetMeetingController(getMeetingUseCase);


const getMeetingByAccountIdController = new GetMeetingByAccountIdController(getMeetingByAccountIdUseCase);

export { getMeetingController, getMeetingByAccountIdController };
