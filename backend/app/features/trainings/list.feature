Feature: Access to the training list

    Scenario: Attempt to access for no logged user
        Given The user attempt to access to the training list on "training/list"
        When The user is not logged
        Then Redirect to the login page

    Scenario: Attempt to access for logged and not authorized user
        Given The user attempt to access to the training list on "training/list"
        When The user is not authorized
        Then Redirect user to the Not authorized 403 page
        And Display message "Not authorized"

    Scenario: Attempt to access for logged and authorized user
        Given The user attempt to access to the training list on "training/list"
        When The user is authorized
        Then Show the training list page
        And Display the training list
