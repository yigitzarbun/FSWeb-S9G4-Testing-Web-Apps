import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "./../App";

test("hata olmadan render ediliyor", () => {
  render(<App />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByText(/İletişim Formu/i);
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const name = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(name, "Abc");
  const errorText = screen.getByTestId("error");
  expect(errorText).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const name = screen.getByPlaceholderText(/İlhan/i);
  const surname = screen.getByPlaceholderText(/Mansız/i);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(name, "a");
  userEvent.type(surname, "a");
  userEvent.clear(surname);
  userEvent.type(email, "d");
  const errorList = await screen.getAllByTestId("error");
  expect(errorList.length).toEqual(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const name = screen.getByPlaceholderText(/İlhan/i);
  const surname = screen.getByPlaceholderText(/Mansız/i);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  const button = screen.getByRole("button");
  userEvent.type(name, "abcdef");
  userEvent.type(surname, "abcdef");
  userEvent.click(button);
  const errorText = screen.getByTestId("error");
  expect(errorText).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(email, "abc");
  const errorText = screen.getByTestId("error");
  expect(errorText).toHaveTextContent(
    "email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const surname = screen.getByPlaceholderText(/Mansız/i);
  const button = screen.getByRole("button");
  userEvent.click(button);
  const errorTextArray = screen.getAllByTestId("error");
  expect(errorTextArray[1]).toHaveTextContent("soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const name = screen.getByPlaceholderText(/İlhan/i);
  const surname = screen.getByPlaceholderText(/Mansız/i);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  const button = screen.getByRole("button");
  expect(name).toBeInTheDocument();
  expect(surname).toBeInTheDocument();
  expect(email).toBeInTheDocument();
  userEvent.click(button);
  const errorTextArray = screen.getAllByTestId("error");
  expect(errorTextArray.length).toEqual(3);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const name = screen.getByPlaceholderText(/İlhan/i);
  const surname = screen.getByPlaceholderText(/Mansız/i);
  const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  const message = screen.getByLabelText("Mesaj");
  const button = screen.getByRole("button");
  userEvent.type(name, "yigit");
  userEvent.type(surname, "zarbun");
  userEvent.type(email, "yigit@abc.com");
  userEvent.type(message, "selam");
  userEvent.click(button);
  const displayName = screen.getByTestId("firstnameDisplay");
  const displayLastName = screen.getByTestId("lastnameDisplay");
  const displayEmail = screen.getByTestId("emailDisplay");
  const displayMessage = screen.getByTestId("messageDisplay");
  expect(displayName).toBeInTheDocument();
  expect(displayLastName).toBeInTheDocument();
  expect(displayEmail).toBeInTheDocument();
  expect(displayMessage).toBeInTheDocument();
  expect(displayName).toHaveTextContent("yigit");
  expect(displayLastName).toHaveTextContent("zarbun");
  expect(displayEmail).toHaveTextContent("yigit@abc.com");
  expect(displayMessage).toHaveTextContent("selam");
});
