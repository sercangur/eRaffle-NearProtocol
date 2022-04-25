import { PersistentVector, storage, context, RNG, logging, u128, ContractPromiseBatch } from "near-sdk-as";
import { AccountId, Money } from "../../utils";
import { Raffle, Ticket } from "./model";


@nearBindgen
export class Contract {

  /****************Storage,Persistent Collections Usage******************/
  private raffles: PersistentVector<Raffle> = new PersistentVector<Raffle>('r');
  private tickets: PersistentVector<Ticket> = new PersistentVector<Ticket>('t');

  @mutateState()
  init(): void {
    this.assert_init()
    storage.set<AccountId>("owner", context.sender.toString())
    logging.log(`Init Success. Owner is ${storage.getSome<AccountId>("owner")}`)
  }

  /****************Raffle Functions******************/
  @mutateState()
  createRaffle(title: String, name: String, category: String, description: String, imageUrl: String, price: Money, maxTicketCount: i32): Raffle {
    let newRaffle = new Raffle(title, name, category, description, imageUrl, price, maxTicketCount);
    let index = this.raffles.push(newRaffle);
    logging.log(`Success. New raffle id: ${index} created by ${storage.getSome<AccountId>("owner")}`);
    return newRaffle;
  }

  @mutateState()
  modifyRaffle(raffleId:i32, title: String, name: String, category: String, description: String, imageUrl: String, price: Money, maxTicketCount: i32): Raffle {
    this.assert_raffleOwner(this.raffles[raffleId]);
    this.assert_raffleId(raffleId);
    this.assert_raffle_is_active(this.raffles[raffleId]);
    this.assert_raffle_is_completed(this.raffles[raffleId]);
    let newRaffle = new Raffle(title, name, category, description, imageUrl, price, maxTicketCount);
    newRaffle.modifiedDate = context.blockTimestamp;
    this.raffles.replace(raffleId,newRaffle);
    logging.log(`Success. Modified raffle id: ${raffleId} modified by ${storage.getSome<AccountId>("owner")}`);
    return this.raffles[raffleId];
  }

  @mutateState()
  completeRaffle(raffleId:i32): Raffle{
    this.assert_raffleOwner(this.raffles[raffleId]);
    this.assert_raffleId(raffleId);
    this.assert_raffle_is_active(this.raffles[raffleId]);
    this.assert_raffle_is_completed(this.raffles[raffleId]);
    logging.log(`raffleId is ${raffleId}, Winner ticketId is ${this.tickets.length}`);
    let element = this.raffles[raffleId];
    let result = new Array<i32>();

    for (let i = 0; i < this.tickets.length; i++) {
      const entry = this.tickets[i];
      if(entry.raffleId==raffleId){
        result.push(i);
      }
    }

    const rng = new RNG<i32>(1, result.length);
    const random1 = rng.next();
    logging.log("random i32: " + random1.toString());

    element.winner_TicketID = result[random1];
    element.winner_AccountID = this.tickets[result[random1]].owner;
    element.isCompleted = true;
    element.completedDate = context.blockTimestamp;

    this.raffles.replace(raffleId,element);
    logging.log(`Success. Completed raffle id: ${raffleId} completed by ${storage.getSome<AccountId>("owner")}`);
    logging.log(`Success. Winner accountId is ${element.winner_AccountID}, Winner ticketId is ${element.winner_TicketID}`);
    return this.raffles[raffleId];
  }

  @mutateState()
  cancelRaffle(raffleId:i32): Raffle{
    this.assert_raffleOwner(this.raffles[raffleId]);
    this.assert_raffleId(raffleId);
    this.assert_raffle_is_active(this.raffles[raffleId]);
    this.assert_raffle_is_completed(this.raffles[raffleId]);
    let element = this.raffles[raffleId];
    element.isActive = false;
    element.deletedDate = context.blockTimestamp;
    this.raffles.replace(raffleId,element);
    logging.log(`Success. Canceled raffle id: ${raffleId} canceled by ${storage.getSome<AccountId>("owner")}`);
    return this.raffles[raffleId];
  }

  getRafflesByRaffleID(raffleId:i32): Raffle | null{
    this.assert_raffleId(raffleId);
    return this.raffles[raffleId];
  }

  getRafflesByAccountId(sender:AccountId): Array<Raffle>{
    let result = new Array<Raffle>();
    for (let i = 0; i < this.raffles.length; i++) {
      const element = this.raffles[i];
      if(element.owner==sender){
        result.push(element);
      }
    }
    return result;
  }

  getAllRaffles(): Array<Raffle>{
    let result = new Array<Raffle>();
    for (let i = 0; i < this.raffles.length; i++) {
      const entry = this.raffles[i];
      result.push(entry);
    }
    return result;
  }

  /*****************Ticket Functions*****************/
  @mutateState()
  buyTicket(raffleId:i32): Ticket{
    this.assert_enoughDeposit(this.raffles[raffleId].price)
    this.assert_max_tickets(raffleId)
    this.assert_raffleId(raffleId);
    this.assert_raffle_is_active(this.raffles[raffleId]);
    this.assert_raffle_is_completed(this.raffles[raffleId]);
    const sOwner: AccountId = storage.getSome<AccountId>("owner")
    ContractPromiseBatch.create(sOwner).transfer(this.raffles[raffleId].price);
    let newTicket = new Ticket(raffleId);
    let index = this.tickets.push(newTicket);
    logging.log(`Success. Bought ticket id: ${index}, Price is ${this.raffles[raffleId].price} bought by ${storage.getSome<AccountId>("owner")}`);
    return newTicket;
  }

  getTicketsByAccountId(sender:AccountId): Array<Ticket> {
    let result = new Array<Ticket>();
    for (let i = 0; i < this.tickets.length; i++) {
      const entry = this.tickets[i];
      if(entry.owner==sender){
        result.push(entry);
      }
    }
    return result;
  }

  getTicketsByRaffleId(raffleId:i32): Array<Ticket>{
    this.assert_raffleId(raffleId);
    let result = new Array<Ticket>();
    for (let i = 0; i < this.tickets.length; i++) {
      const element = this.tickets[i];
      if(element.raffleId==raffleId){
        result.push(element);
      }
    }
    return result;
  }

  getAllTickets(): Array<Ticket>{
    let result = new Array<Ticket>();
    for (let i = 0; i < this.tickets.length; i++) {
      const entry = this.tickets[i];
      result.push(entry);
    }
    return result;
  }

  /*****************For Details*****************/
  getMoneyDetails(raffleId:i32): String{
    return `attachedDeposit:${context.attachedDeposit};  price:${u128.from(this.raffles[raffleId].price)}; contractNameer:${context.contractName}
    ; accountBalance:${context.accountBalance}; predecessor:${context.predecessor}; sender:${context.sender}; usedGas:${context.usedGas}`
  }

  getContextDetails(): String{
    return ` storageOwner:${storage.getSome<AccountId>("owner")}
    ; sender:${context.sender} ; predecessor:${context.predecessor} ; attachedDeposit:${context.attachedDeposit} ; accountBalance:${context.accountBalance}
    ; blockIndex:${context.blockIndex} ; blockTimestamp:${context.blockTimestamp} ; contractName:${context.contractName} ; epochHeight:${context.epochHeight}
    ; prepaidGas:${context.prepaidGas} ; senderPublicKey:${context.senderPublicKey} ; storageUsage:${context.storageUsage} ; usedGas:${context.usedGas}`
  }

  /*****************Assert Functions*****************/
  private assert_init(): void {
    assert(!storage.contains("owner"), `Contract initialized before! storageOwner:${storage.getSome<AccountId>("owner")}`)
  }

  private assert_raffleOwner(raffle: Raffle): void {
    assert(storage.getSome<AccountId>("owner") == raffle.owner
      , `storageOwner:${storage.getSome<AccountId>("owner")}, raffle.owner:${raffle.owner} : Only the owner of this raffle may call this method`);
  }
  
  private assert_raffleId(id: i32): void {
    assert(this.raffles.containsIndex(id), 'Raffle not exists');
  }

  private assert_raffle_is_active(raffle: Raffle): void {
    assert(raffle.isActive, 'Raffle is inactive');
  }

  private assert_raffle_is_completed(raffle: Raffle): void {
    assert(!raffle.isCompleted, 'Raffle is completed');
  }

  private assert_enoughDeposit(price: Money): void {
    assert(context.attachedDeposit >= price, `attachedDeposit:${context.attachedDeposit}, price:${price} Please send enough NEAR!`)
  }

  private assert_max_tickets(raffleId: i32): void {
    let count = 0;
    for (let i = 0; i < this.tickets.length; i++) {
      const entry = this.tickets[i];
      if(entry.raffleId == raffleId){count = count + 1;}
    }
    assert(count < this.raffles[raffleId].maxTicketCount, `All tickets are sold out!`)
  }

}
