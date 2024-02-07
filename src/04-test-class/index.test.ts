import lodash from 'lodash';
import {
  getBankAccount,
  TransferFailedError,
  InsufficientFundsError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 300;
    const account = getBankAccount(balance);
    expect(account.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(300);
    expect(() => account.withdraw(400)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const sender = getBankAccount(300);
    const recipient = getBankAccount(0);
    expect(() => sender.transfer(400, recipient)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(300);
    expect(() => account.transfer(200, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initialBalance = 300;
    const depositAmount = 200;
    const account = getBankAccount(initialBalance);

    account.deposit(depositAmount);

    expect(account.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const initialBalance = 300;
    const withdrawAmount = 200;
    const account = getBankAccount(initialBalance);

    account.withdraw(withdrawAmount);

    expect(account.getBalance()).toBe(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const senderInitBalance = 300;
    const recipientInitBalance = 0;
    const transferAmount = 200;
    const sender = getBankAccount(senderInitBalance);
    const recipient = getBankAccount(recipientInitBalance);

    sender.transfer(transferAmount, recipient);

    expect(sender.getBalance()).toBe(senderInitBalance - transferAmount);
    expect(recipient.getBalance()).toBe(recipientInitBalance + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomMock = jest.spyOn(lodash, 'random').mockReturnValue(1);
    const balance = await getBankAccount(300).fetchBalance();
    expect(balance).toEqual(expect.any(Number));
    randomMock.mockRestore();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(300);
    const number = 500;
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(number);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(number);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(300);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
