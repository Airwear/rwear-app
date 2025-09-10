Feature: Create the new training
    As a logged in user, I must be able to enter training at any time.
    I must have authorization to enter a training.

    Rules:
    - The user must be logged
    - The user must have the creating authorization

    Scenario: Attempt to create for no logged user
        Given The user attempt to access to the training create page on "training/create"
        When The user is not logged
        Then Redirect to the login page

    Scenario: Attempt to create for logged and not authorized user
        Given The user attempt to access to the training create page on "training/create"
        When The user is not authorized
        Then Redirect user to the Not authorized 403 page
        And Display message "Not authorized"

    Scenario: Attempt to create for logged and authorized user
        Given The user attempt to access to the training create page on "training/create"
        When The user is authorized
        Then Show the training create page
        And Display the training create forms

    Scenario: Attempt to create for logged and authorized user with not required form fields
        Given The user attempt to post the news training
        When The required fields are not completed
        Then Redirect to training create page
        And Display the errors informations

    Scenario: Attempt to create for logged and authorized user with required form fields
        Given The user attempt to post the news training
        When The required fields are completed
        Then Save the new training
        And Redirect to training edit page
        And Display the success message information
