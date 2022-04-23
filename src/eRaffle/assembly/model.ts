import { Context } from "near-sdk-as";
import { AccountId, Timestamp, Money} from "../../utils";


@nearBindgen
export class Raffle {
    owner: AccountId = Context.sender;
    title: String;
    name: String;
    category: String;
    description: String;
    imageUrl: String;
    price: Money;
    maxTicketCount: i32;
    isActive: bool = true;
    isCompleted: bool = false;
    winner_AccountID: AccountId
    winner_TicketID: i32
    createdDate: Timestamp = Context.blockTimestamp;
    modifiedDate: Timestamp;
    deletedDate: Timestamp;
    completedDate: Timestamp;

    constructor(_title: String,
                _name: String,
                _category: String,
                _description: String,
                _imageUrl: String,
                _price: Money,
                _maxTicketCount: i32) {
        this.title = _title;
        this.name = _name;
        this.category = _category;
        this.description = _description;
        this.imageUrl = _imageUrl;
        this.price = _price;
        this.maxTicketCount = _maxTicketCount;
    };
}

@nearBindgen
export class Ticket {
    owner: AccountId = Context.sender;
    raffleId: i32;
    isRefund: bool = false;
    createdDate: Timestamp = Context.blockTimestamp;
    returnDate: Timestamp;

    constructor(_raffleId: i32){
        this.raffleId = _raffleId;
    };
}
