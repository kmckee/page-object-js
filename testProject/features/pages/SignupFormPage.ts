import {Button, Span, IdLocator} from 'page-object-js';

export class SignupFormPage {
    public signUp: Button = new Button(new IdLocator('sign-up'));
    public foo: Button = new Button(new IdLocator('foo'));
    public submitCount: Span = new Span(new IdLocator('submit-count'));
    public deleteDatabase: Button = new Button(new IdLocator('delete-database'));
}
